import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  MicrophoneIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  StopIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const quickQuestions = [
  "Open the collection",
  "Search sandalwood",
  "Go to my cart",
  "Scroll down",
];

const MAX_QUANTITY = 99;
const API_BASE_URL = (import.meta.env.VITE_BASE_URL || "").replace(/\/+$/, "");
const quantityWords = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
};
const queryStopWords = new Set([
  "a", "an", "and", "are", "can", "details", "find", "for", "get", "help",
  "i", "incense", "in", "item", "items", "me", "my", "of", "on", "order",
  "orders", "please", "product", "products", "purchase", "recommend", "show",
  "scent", "scents", "search", "smell", "some", "sticks", "stick", "the",
  "to", "want", "with", "buy", "add", "put", "into", "bag", "basket", "cart",
  "qty", "quantity", "set", "change", "update", "reduce", "decrease", "remove",
  "delete", "take", "out", "from", "make", "of", "price", "cost", "available",
  "looking", "like", "would", "could", "please", "me",
  "fragrance", "fragrances", "one", "two", "three", "four", "five",
  "six", "seven", "eight", "nine", "ten",
]);

const normalize = (value = "") =>
  String(value).toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();

const extractProductQuery = (message) => {
  const words = normalize(message)
    .split(" ")
    .filter((word) => word && !/^\d+$/.test(word) && !queryStopWords.has(word));
  return words.join(" ");
};

const getRequestedQuantity = (message) => {
  const normalized = normalize(message);
  const match = normalized.match(/\b(?:qty|quantity)\s*(?:to|of|is)?\s*(\d+)\b/)
    || normalized.match(/\b(?:add|buy|order|purchase|get|want|need|like)\s+(?:me\s+)?(\d+)\b/)
    || normalized.match(/\b(\d+)\s+(?:x|of)\b/);
  if (match) return Number(match[1]);

  const wordQuantity = normalized.match(/\b(?:add|buy|order|purchase|get|want|need|like)\s+(?:me\s+)?(one|two|three|four|five|six|seven|eight|nine|ten)\b/)
    || normalized.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\s+(?:x|of)\b/);
  const word = wordQuantity?.[1] || wordQuantity?.[2];
  return word ? quantityWords[word] : 1;
};

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const apiRequest = async (path, { method = "GET", body, token } = {}) => {
  if (!API_BASE_URL) {
    throw new Error("The store API is not configured.");
  }

  const headers = { "Content-Type": "application/json" };
  if (token) headers.token = token;

  const response = await fetch(API_BASE_URL + path, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const json = await response.json().catch(() => ({}));

  if (!response.ok || !json.success) {
    const error = new Error(json.message || "The store could not complete that request.");
    error.status = response.status;
    throw error;
  }
  return json;
};

const loginPrompt = (task) => ({
  text: "Sign in to " + task + ". Your account is required for private cart and order actions.",
  actions: [{ label: "Sign in", type: "navigate", path: "/login" }],
});

const scoreProduct = (product, terms) => {
  const title = normalize(product.title);
  const searchable = normalize([
    product.title,
    product.brand_name,
    product.category,
    product.fragnance_type,
    product.description,
    product.material,
  ].filter(Boolean).join(" "));

  let score = 0;
  let matched = 0;
  terms.forEach((term) => {
    if (title.includes(term)) {
      score += 7;
      matched += 1;
    } else if (searchable.includes(term)) {
      score += 3;
      matched += 1;
    }
  });

  return matched === 0 ? 0 : score + (matched / Math.max(terms.length, 1));
};

const fetchMatchingProducts = async (query) => {
  const terms = normalize(query).split(" ").filter(Boolean);
  const searches = [...new Set([query, ...terms])].slice(0, 4);
  const productsById = new Map();

  for (const search of searches) {
    const result = await apiRequest("/api/product/fetch-all-products", {
      method: "POST",
      body: { skip: 0, search: search.slice(0, 50) },
    });
    (result.data || []).forEach((product) => productsById.set(product._id, product));
  }

  if (productsById.size === 0) {
    const result = await apiRequest("/api/product/fetch-all-products", {
      method: "POST",
      body: { skip: 0 },
    });
    (result.data || []).forEach((product) => productsById.set(product._id, product));
  }

  return [...productsById.values()]
    .map((product) => ({ product, score: scoreProduct(product, terms) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || Number(b.product.stock) - Number(a.product.stock))
    .slice(0, 3)
    .map((entry) => entry.product);
};

const scoreCartItem = (item, terms) => {
  const title = normalize(item.product_title);
  const matches = terms.filter((term) => title.includes(term)).length;
  return matches === 0 ? 0 : matches * 5 + matches / Math.max(terms.length, 1);
};

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 0,
      role: "assistant",
      text: "Hi! I can navigate the store, search products, manage your cart, and show recent orders. Tap the microphone and say “open the collection,” “search sandalwood,” or “go to my cart.” I’ll leave payment for you to review and complete.",
    },
  ]);
  const endRef = useRef(null);
  const nextMessageId = useRef(1);
  const aiHistoryRef = useRef([]);
  const speechRecognitionRef = useRef(null);
  const latestActionsRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isOpen, isTyping]);

  const appendReply = (reply) => {
    latestActionsRef.current = reply.actions || [];
    setMessages((current) => [
      ...current,
      {
        id: nextMessageId.current++,
        role: "assistant",
        text: reply.text,
        actions: reply.actions || [],
      },
    ]);
  };

  const speakReply = (text) => {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;

    const spokenText = String(text || "")
      .replace(/[\n\r]+/g, ". ")
      .replace(/\s+/g, " ")
      .trim();
    if (!spokenText) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      spokenText.length > 420 ? spokenText.slice(0, 417) + "..." : spokenText,
    );
    utterance.lang = navigator.language || "en-IN";
    window.speechSynthesis.speak(utterance);
  };

  const runWebsiteCommand = (message) => {
    const query = normalize(message);
    const navigateTo = (path) => {
      navigate(path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const goTo = (path, label) => {
      navigateTo(path);
      return { text: "Opening " + label + "." };
    };

    const choiceMatch = query.match(/^(add|remove|open|view|choose|select|pick) (?:the )?(first|1st|1|second|2nd|2|third|3rd|3)(?: (?:result|option|product|item|one))?$/);
    if (choiceMatch) {
      const choiceIndex = ({ first: 0, "1st": 0, "1": 0, second: 1, "2nd": 1, "2": 1, third: 2, "3rd": 2, "3": 2 })[choiceMatch[2]];
      const requestedAction = choiceMatch[1];
      const actions = latestActionsRef.current;
      const compatibleActions = requestedAction === "add"
        ? actions.filter((action) => action.type === "addProduct")
        : requestedAction === "remove"
          ? actions.filter((action) => action.type === "removeCartItem")
          : requestedAction === "open" || requestedAction === "view"
            ? actions.filter((action) => action.type === "navigate")
            : actions.some((action) => action.type === "navigate" && action.path?.startsWith("/product-page/"))
              ? actions.filter((action) => action.type === "navigate" && action.path?.startsWith("/product-page/"))
              : actions.some((action) => action.type === "addProduct")
                ? actions.filter((action) => action.type === "addProduct")
                : actions.filter((action) => action.type === "navigate");
      const selectedAction = compatibleActions[choiceIndex];

      if (!selectedAction) {
        return { text: "I don't have that choice available. Ask me to search for a product or show your cart first." };
      }
      if (selectedAction.type === "navigate") {
        navigateTo(selectedAction.path);
        return { text: "Opening the selected item." };
      }
      if (selectedAction.type === "addProduct") {
        return { execute: () => addProductToCart(selectedAction.product, selectedAction.quantity) };
      }
      return { execute: () => removeCartItem(selectedAction.item) };
    }

    if (/^(?:(?:please )?(?:go to|take me to|navigate to|open|show|visit) )?(?:the )?(?:home|home page|homepage)$/.test(query)) {
      return goTo("/", "the home page");
    }
    if (/^(?:(?:please )?(?:go to|take me to|navigate to|open|show|visit|browse|explore|shop) )?(?:the )?(?:product page|products page|products|collection|our collection|incense collection|catalogue|catalog|all products|shop)$/.test(query)) {
      return goTo("/fetch-products", "the collection");
    }
    if (/^(?:(?:please )?(?:go to|take me to|open|show|view|visit) )?(?:my |the )?(?:cart|bag|basket|checkout)(?: page)?$/.test(query)) {
      return goTo("/cart", "your cart");
    }
    if (/^(?:(?:please )?(?:go to|take me to|open|show|visit) )?(?:the )?(?:sign in|login|log in|account)(?: page)?$/.test(query)) {
      return goTo("/login", "sign in");
    }
    if (/^(?:go back|back|previous page)$/.test(query)) {
      if (window.history.length > 1) {
        navigate(-1);
        return { text: "Going back one page." };
      }
      return { text: "There isn't a previous page in this visit yet." };
    }
    if (/^(?:go forward|forward|next page)$/.test(query)) {
      navigate(1);
      return { text: "Going forward one page." };
    }

    const searchMatch = query.match(/^(?:please )?(?:search(?: for)?|find(?: me)?|look for) (.+)$/);
    if (searchMatch?.[1]) {
      const search = searchMatch[1].trim();
      navigateTo("/fetch-products?search=" + encodeURIComponent(search));
      return { text: "Searching the collection for " + search + "." };
    }

    const sections = Array.from(document.querySelectorAll("[data-voice-section]"));
    const scrollToSection = (section) => {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      return { text: "Taking you to " + (section.dataset.voiceSection || "that section") + "." };
    };
    const activeSectionIndex = () => sections.reduce((activeIndex, section, index) => (
      section.getBoundingClientRect().top <= 150 ? index : activeIndex
    ), -1);

    if (/^(?:go to )?(?:the )?top(?: of (?:the )?page)?$|^scroll to top$/.test(query)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return { text: "Taking you to the top of the page." };
    }
    if (/^(?:go to )?(?:the )?bottom(?: of (?:the )?page)?$|^scroll to bottom$/.test(query)) {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
      return { text: "Taking you to the bottom of the page." };
    }
    if (/^(?:next|previous) section$/.test(query)) {
      if (!sections.length) return { text: "There are no page sections to move between here." };
      const direction = query.startsWith("next") ? 1 : -1;
      const index = Math.min(sections.length - 1, Math.max(0, activeSectionIndex() + direction));
      return scrollToSection(sections[index]);
    }
    if (/^(?:scroll )?(?:down|up)$/.test(query)) {
      window.scrollBy({
        top: (query.endsWith("up") ? -1 : 1) * Math.round(window.innerHeight * 0.75),
        behavior: "smooth",
      });
      return { text: query.endsWith("up") ? "Scrolling up." : "Scrolling down." };
    }

    const sectionMatch = query.match(/^(?:please )?(?:go to|take me to|scroll to|jump to|show me|open) (?:the )?(.+?)(?: section| collection| area)?$/);
    if (sectionMatch?.[1] && sections.length) {
      const requestedSection = sectionMatch[1].trim();
      const match = sections.find((section) => {
        const label = normalize(section.dataset.voiceSection || "");
        return label === requestedSection || label.includes(requestedSection) || requestedSection.includes(label);
      });
      if (match) return scrollToSection(match);
      navigateTo("/fetch-products?search=" + encodeURIComponent(requestedSection));
      return { text: "I couldn't find that section on this page, so I'm searching the collection for " + requestedSection + "." };
    }

    return null;
  };

  const addProductToCart = async (product, quantity) => {
    const token = sessionStorage.getItem("userToken");
    if (!token) return loginPrompt("add products to your cart");
    if (Number(product.stock) <= 0) {
      return { text: product.title + " is currently out of stock. I can show you similar items." };
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      return { text: "Choose a quantity from 1 to " + MAX_QUANTITY + " and I’ll add it to your cart." };
    }

    await apiRequest("/api/cart/add-to-cart", {
      method: "POST",
      token,
      body: { product_id: product._id || product.product_id, quantity },
    });

    return {
      text: "Added " + quantity + " × " + product.title + " to your cart. No payment has been taken. Review the items, enter delivery details, and complete payment at checkout.",
      actions: [{ label: "Review cart & checkout", type: "navigate", path: "/cart" }],
    };
  };

  const fetchCart = async () => {
    const token = sessionStorage.getItem("userToken");
    if (!token) throw new Error("Sign in to view your cart.");
    const result = await apiRequest("/api/cart/fetch-cart-products", { token });
    return result.data || [];
  };

  const removeCartItem = async (item) => {
    const token = sessionStorage.getItem("userToken");
    if (!token) return loginPrompt("manage your cart");

    await apiRequest("/api/cart/remove-from-cart", {
      method: "DELETE",
      token,
      body: { product_id: item.product_id },
    });
    return { text: "Removed " + item.product_title + " from your cart." };
  };

  const showCart = async () => {
    const token = sessionStorage.getItem("userToken");
    if (!token) return loginPrompt("view your cart");

    const items = await fetchCart();
    if (items.length === 0) {
      return {
        text: "Your cart is empty. Tell me what you’re looking for and I can find products.",
        actions: [{ label: "Browse products", type: "navigate", path: "/fetch-products" }],
      };
    }

    const totalItems = items.reduce((total, item) => total + Number(item.quantity || 0), 0);
    const subtotal = items.reduce(
      (total, item) => total + Number(item.product_price || 0) * Number(item.quantity || 0),
      0,
    );
    const lines = items.slice(0, 5).map((item) =>
      "• " + item.product_title + " — " + item.quantity + " × " + formatPrice(item.product_price),
    );
    if (items.length > 5) lines.push("…and " + (items.length - 5) + " more item types.");

    return {
      text: "Your cart has " + totalItems + " item(s):\n" + lines.join("\n")
        + "\nSubtotal: " + formatPrice(subtotal)
        + "\nOpen checkout to confirm delivery details and the final payable amount.",
      actions: [
        { label: "Checkout", type: "navigate", path: "/cart" },
        ...items.slice(0, 4).map((item) => ({
          label: "Remove " + item.product_title,
          type: "removeCartItem",
          item,
        })),
      ],
    };
  };

  const updateCartItem = async (message) => {
    const token = sessionStorage.getItem("userToken");
    if (!token) return loginPrompt("manage your cart");

    const items = await fetchCart();
    if (items.length === 0) return { text: "Your cart is already empty." };

    const query = extractProductQuery(message);
    const terms = query ? query.split(" ").filter(Boolean) : [];
    const matches = terms.length
      ? items
        .map((item) => ({ item, score: scoreCartItem(item, terms) }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score)
      : [];
    const item = matches.length
      ? matches[0].item
      : (!terms.length && items.length === 1 ? items[0] : null);

    if (!item) {
      return {
        text: "Which cart item should I change? Choose one below, or say “show my cart.”",
        actions: items.slice(0, 5).map((cartItem) => ({
          label: "Remove " + cartItem.product_title,
          type: "removeCartItem",
          item: cartItem,
        })),
      };
    }

    if (matches.length > 1 && matches[0].score === matches[1].score) {
      return {
        text: "I found more than one matching cart item. Which one did you mean?",
        actions: matches.slice(0, 4).map(({ item: cartItem }) => ({
          label: "Remove " + cartItem.product_title,
          type: "removeCartItem",
          item: cartItem,
        })),
      };
    }

    const normalized = normalize(message);
    const setMatch = normalized.match(/\b(?:set|change|update)\b.*?\bto\s+(\d+)\b/)
      || normalized.match(/\b(?:quantity|qty)\s*(?:to|of)?\s*(\d+)\b/);

    if (/\b(?:set|change|update)\b/.test(normalized) && !setMatch) {
      return { text: "What quantity should I set? For example: “set sandalwood to 3.”" };
    }

    let targetQuantity;
    if (setMatch) {
      targetQuantity = Number(setMatch[1]);
    } else if (/\b(?:reduce|decrease|lower)\b/.test(normalized) || /\bremove\s+\d+\b/.test(normalized)) {
      const amount = getRequestedQuantity(message);
      targetQuantity = Math.max(0, Number(item.quantity) - amount);
    } else {
      targetQuantity = 0;
    }

    if (targetQuantity > MAX_QUANTITY) {
      return { text: "I can manage up to " + MAX_QUANTITY + " of one item in a single cart request." };
    }

    if (targetQuantity === 0) {
      await apiRequest("/api/cart/remove-from-cart", {
        method: "DELETE",
        token,
        body: { product_id: item.product_id },
      });
      return { text: "Removed " + item.product_title + " from your cart." };
    }

    const difference = targetQuantity - Number(item.quantity);
    if (difference > 0) {
      await apiRequest("/api/cart/add-to-cart", {
        method: "POST",
        token,
        body: { product_id: item.product_id, quantity: difference },
      });
    } else if (difference < 0) {
      for (let count = 0; count < Math.abs(difference); count += 1) {
        await apiRequest("/api/cart/reduce-from-cart", {
          method: "POST",
          token,
          body: { product_id: item.product_id, quantity: 1 },
        });
      }
    }

    return {
      text: "Updated " + item.product_title + " to " + targetQuantity + " in your cart.",
      actions: [{ label: "Review cart", type: "navigate", path: "/cart" }],
    };
  };

  const showRecentOrders = async () => {
    const token = sessionStorage.getItem("userToken");
    if (!token) return loginPrompt("view your recent orders");

    const result = await apiRequest("/api/order/fetch-my-orders", { token });
    const orders = result.data || [];
    if (orders.length === 0) {
      return { text: "I couldn’t find a completed order on this account yet." };
    }

    const orderLines = orders.map((order) => {
      const date = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" })
        .format(new Date(order.createdAt));
      const products = (order.order_details || [])
        .map((item) => item.product_title + " × " + item.product_quantity)
        .join(", ");
      return "• Order #" + String(order._id).slice(-7) + " — " + date + " — "
        + formatPrice(order.total_amount) + "\n  " + products;
    });

    return {
      text: "Your recent confirmed orders:\n" + orderLines.join("\n")
        + "\nThis store records paid orders but doesn’t provide shipment tracking or cancellation here. Contact the store team for delivery updates.",
      actions: [{ label: "Browse products", type: "navigate", path: "/fetch-products" }],
    };
  };

  const askLanguageModel = async (message) => {
    const token = sessionStorage.getItem("userToken");
    const result = await apiRequest("/api/chat/assistant", {
      method: "POST",
      body: { message, history: aiHistoryRef.current },
      token,
    });
    const reply = result.reply || "I couldn’t create a reply. Please try again.";
    aiHistoryRef.current = [
      ...aiHistoryRef.current,
      { role: "user", content: message },
      { role: "assistant", content: reply },
    ].slice(-8);
    return { text: reply, actions: result.actions || [], usedLanguageModel: true };
  };

  const searchProducts = async (message, isOrderRequest) => {
    const quantity = getRequestedQuantity(message);
    if (quantity > MAX_QUANTITY) {
      return { text: "I can add up to " + MAX_QUANTITY + " of an item in one request." };
    }

    const productTerms = extractProductQuery(message);
    const hasProductCategory = /\b(?:incense|sticks?|fragrances?|scents?|aroma)\b/.test(normalize(message));
    if (isOrderRequest && !productTerms && !hasProductCategory) {
      return {
        text: "Which product would you like? Say a product name or fragrance, for example “buy two sandalwood incense.”",
        actions: [
          { label: "Browse products", type: "navigate", path: "/fetch-products" },
          { label: "Review cart", type: "navigate", path: "/cart" },
        ],
      };
    }
    const query = productTerms || "incense";
    const products = await fetchMatchingProducts(query);
    if (products.length === 0) {
      return {
        text: "I couldn’t find a close match for “" + query + ".” Try a product name, brand, fragrance, or category.",
        actions: [{ label: "Browse the collection", type: "navigate", path: "/fetch-products" }],
      };
    }

    if (isOrderRequest) {
      const first = products[0];
      const second = products[1];
      const searchTerms = query.split(" ");
      const confidentMatch = products.length === 1
        || normalize(first.title) === normalize(query)
        || (Number(first.stock) > 0 && second
          && scoreProduct(first, searchTerms) - scoreProduct(second, searchTerms) >= 5);

      if (confidentMatch) {
        return addProductToCart(first, quantity);
      }

      return {
        text: "I found a few possible matches. Choose the exact product you want me to add:"
          + products.map((product) => "\n• " + product.title + " — " + formatPrice(product.actual_price)
            + (Number(product.stock) > 0 ? "" : " (out of stock)")).join(""),
        actions: products.map((product) => ({
          label: Number(product.stock) > 0 ? "Add " + product.title + " × " + quantity : product.title + " (out of stock)",
          type: Number(product.stock) > 0 ? "addProduct" : "navigate",
          product,
          quantity,
          path: "/product-page/" + product._id,
        })),
      };
    }

    return {
      text: "Here are some matches:" + products.map((product) =>
        "\n• " + product.title + " — " + formatPrice(product.actual_price)
          + (Number(product.stock) > 0 ? ", in stock" : ", out of stock"),
      ).join(""),
      actions: products.flatMap((product) => [
        { label: "View " + product.title, type: "navigate", path: "/product-page/" + product._id },
        ...(Number(product.stock) > 0
          ? [{ label: "Add " + product.title, type: "addProduct", product, quantity: 1 }]
          : []),
      ]),
    };
  };

  const answerDeterministically = async (message) => {
    const query = normalize(message);

    if (/\b(?:track|tracking)\b|\b(?:status|history|recent|past)\b.*\borders?\b|\borders?\b.*\b(?:status|history|tracking|track)\b|\bmy orders?\b|\bwhere (?:is|s) my orders?\b/.test(query)) {
      return showRecentOrders();
    }
    if (/\b(?:cancel|refund|return)\b/.test(query)) {
      return {
        text: "I can’t cancel or refund an order from chat because this store has no cancellation or refund action wired in. Please contact the store team using the contact details in the footer.",
      };
    }
    if (/\b(?:change|edit|update|correct)\b.*\baddress\b|\baddress\b.*\b(?:change|edit|update|correct)\b/.test(query)) {
      return {
        text: "Delivery details can be entered or corrected on the checkout page before payment. For an already-paid order, contact the store team using the footer details.",
        actions: [{ label: "Open checkout", type: "navigate", path: "/cart" }],
      };
    }
    if (/\b(?:clear|empty|remove all|delete all)\b.*\b(?:cart|bag|basket)\b/.test(query)) {
      const token = sessionStorage.getItem("userToken");
      if (!token) return loginPrompt("clear your cart");
      const items = await fetchCart();
      if (items.length === 0) return { text: "Your cart is already empty." };
      for (const item of items) {
        await apiRequest("/api/cart/remove-from-cart", {
          method: "DELETE",
          token,
          body: { product_id: item.product_id },
        });
      }
      return { text: "Your cart is now empty." };
    }
    if (/\b(?:remove|delete|reduce|decrease|lower|set|change|update)\b/.test(query)) {
      return updateCartItem(message);
    }
    if (/\b(?:cart|bag|basket|checkout|payment|pay)\b/.test(query)) {
      return showCart();
    }
    if (/\b(?:shipping|delivery|deliver)\b/.test(query)) {
      return {
        text: "The store delivers across India. Add items to your cart, then enter your delivery address and review the payable amount at checkout.",
        actions: [{ label: "Browse products", type: "navigate", path: "/fetch-products" }],
      };
    }
    if (/\b(?:sign in|login|log in|account)\b/.test(query)) {
      return {
        text: "Sign in to add items, manage your cart, and view recent orders.",
        actions: [{ label: "Sign in", type: "navigate", path: "/login" }],
      };
    }
    if (/\border\s+(?:help|issue|problem)\b|\bhelp\s+with\s+(?:my\s+)?order\b/.test(query)) {
      return {
        text: "I can show recent paid orders, but the store doesn’t offer chat-based cancellation or delivery tracking. For an order issue, contact the store team using the contact details in the footer.",
        actions: [{ label: "Show recent orders", type: "sendMessage", message: "Show my recent orders" }],
      };
    }
    if (/\b(?:buy|add|order|purchase|put|place)\b/.test(query)
      || /\b(?:i want|i need|i would like|looking for)\b/.test(query)) {
      return searchProducts(message, true);
    }
    if (/\b(?:find|search|show|recommend|suggest|browse|fragrance|scent|smell|product|incense)\b/.test(query)) {
      return searchProducts(message, false);
    }
    if (/\b(?:hello|hi|hey)\b/.test(query)) {
      return { text: "Hello! Tell me a fragrance or product you like, or ask me to show your cart or recent orders." };
    }
    return { text: "I can help find products, add or update cart items, explain delivery, and show recent orders. Try ‘find sandalwood’, ‘add two jasmine incense’, or ‘show my cart’. General AI replies are temporarily unavailable." };
  };

  const answerMessage = async (message) => {
    const websiteCommand = runWebsiteCommand(message);
    if (websiteCommand?.execute) return websiteCommand.execute();
    if (websiteCommand) return websiteCommand;

    const normalized = normalize(message);
    const storeIntent = /\b(?:track|tracking|order|orders|cart|bag|basket|checkout|payment|pay|shipping|delivery|deliver|sign in|login|log in|account|cancel|refund|return|address|clear|empty|remove|delete|reduce|decrease|lower|set|change|update|buy|add|purchase|put|place|find|search|show|recommend|suggest|browse|fragrance|scent|smell|product|incense|stick|hello|hi|hey)\b/;
    if (storeIntent.test(normalized)) {
      aiHistoryRef.current = [];
      return answerDeterministically(message);
    }

    try {
      return await askLanguageModel(message);
    } catch (error) {
      // Keep store tasks available when the model service is unavailable or out of credits.
      if ([401, 403, 429, 500, 502, 503].includes(error.status) || !error.status) {
        aiHistoryRef.current = [];
        return answerDeterministically(message);
      }
      throw error;
    }
  };

  const sendMessage = async (value = draft, { fromVoice = false } = {}) => {
    const text = value.trim();
    if (!text || isTyping) return;

    setDraft("");
    setMessages((current) => [
      ...current,
      { id: nextMessageId.current++, role: "user", text },
    ]);
    setIsTyping(true);
    try {
      const reply = await answerMessage(text);
      if (!reply.usedLanguageModel) aiHistoryRef.current = [];
      appendReply(reply);
      if (fromVoice) speakReply(reply.text);
    } catch (error) {
      const errorText = error.message || "I couldn’t complete that request. Please try again.";
      appendReply({ text: errorText });
      if (fromVoice) speakReply(errorText);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleVoiceInput = () => {
    if (isTyping) return;
    if (isListening) {
      speechRecognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      appendReply({ text: "Voice input is not supported in this browser. Try the latest Chrome or Edge, or type your message." });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = navigator.language || "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    speechRecognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results || [])
        .map((result) => result[0]?.transcript || "")
        .join(" ")
        .trim();
      if (!transcript) {
        appendReply({ text: "I couldn't hear a clear phrase. Check your microphone and try again." });
        return;
      }
      setIsListening(false);
      void sendMessage(transcript, { fromVoice: true });
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      const messagesByError = {
        "not-allowed": "Microphone access is blocked. Allow it for this site in your browser and in Windows microphone privacy settings.",
        "service-not-allowed": "Your browser blocked its speech-recognition service. Check browser permissions and try again.",
        "audio-capture": "The browser cannot access a microphone. Check that Windows detects your microphone.",
        network: "The browser speech service needs an internet connection. Check your connection and try again.",
        "no-speech": "I couldn't hear speech. Check your microphone and try again.",
      };
      if (event.error !== "aborted") {
        appendReply({ text: messagesByError[event.error] || "Voice recognition stopped. Try again or type your message." });
      }
    };
    recognition.onend = () => {
      setIsListening(false);
      speechRecognitionRef.current = null;
    };

    try {
      recognition.start();
      setIsListening(true);
    } catch {
      speechRecognitionRef.current = null;
      setIsListening(false);
      appendReply({ text: "Voice recognition couldn't start. Check microphone permission and try again." });
    }
  };

  useEffect(() => () => {
    speechRecognitionRef.current?.abort();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const runAction = async (action) => {
    if (isTyping) return;
    if (action.type === "navigate") {
      setIsOpen(false);
      navigate(action.path);
      return;
    }
    if (action.type === "sendMessage") {
      await sendMessage(action.message);
      return;
    }

    setIsTyping(true);
    try {
      if (action.type === "addProduct") {
        appendReply(await addProductToCart(action.product, action.quantity));
      } else if (action.type === "removeCartItem") {
        appendReply(await removeCartItem(action.item));
      }
    } catch (error) {
      appendReply({ text: error.message || "I couldn’t complete that request. Please try again." });
    } finally {
      setIsTyping(false);
    }
  };

  const goTo = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const closeChat = () => {
    if (isListening) {
      speechRecognitionRef.current?.abort();
      setIsListening(false);
    }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsOpen(false);
  };

  const handleLauncherClick = () => {
    if (isOpen) {
      closeChat();
      return;
    }
    setIsOpen(true);
    toggleVoiceInput();
  };

  return (
    <div className="fixed right-[max(22px,env(safe-area-inset-right))] bottom-[max(22px,env(safe-area-inset-bottom))] z-[65] flex flex-col items-end gap-3 max-sm:right-[max(14px,env(safe-area-inset-right))] max-sm:bottom-[max(14px,env(safe-area-inset-bottom))]" aria-live="polite">
      {isOpen && (
        <section className="flex h-[min(610px,calc(100svh_-_116px))] max-h-[min(610px,calc(100svh_-_116px))] w-[min(390px,calc(100vw_-_28px))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 animate-chat-enter dark:border-slate-700 dark:bg-slate-900 max-sm:h-[min(580px,calc(100svh_-_90px))] max-sm:max-h-[min(580px,calc(100svh_-_90px))] max-sm:w-[min(370px,calc(100vw_-_28px))]" aria-label="Aura & Ember voice shopping agent">
          <header className="flex items-center gap-3 bg-rose-950 px-4 py-4 text-white">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-orange-200/40 bg-orange-300/10 text-orange-200"><SparklesIcon className="h-5 w-5" aria-hidden="true" /></div>
            <div>
              <p className="m-0 font-serif text-base">Voice shopping agent</p>
            <p className="mt-1 flex items-center gap-1.5 text-[9px] text-slate-300"><span className={`h-1.5 w-1.5 rounded-full ${isListening ? "animate-pulse bg-orange-300 shadow-[0_0_9px_rgba(252,211,77,.8)]" : "bg-rose-300 shadow-[0_0_9px_rgba(110,231,183,.6)]"}`} /> {isListening ? "Listening… speak a command" : "Navigation, products & cart"}</p>
            </div>
            <button className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 dark:bg-slate-900/5 text-slate-100 transition hover:bg-white/10 dark:hover:bg-slate-900/10" type="button" onClick={closeChat} aria-label="Close chat">
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </header>

          <p className="m-0 border-b border-slate-200 bg-rose-50 px-4 py-3 text-[10px] leading-relaxed text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">Try “open the collection,” “search sandalwood,” “go to my cart,” “scroll down,” or “add the first one.”</p>

          <div className="flex min-h-[180px] flex-1 flex-col gap-3 overflow-y-auto bg-white px-4 py-4 dark:bg-slate-900" role="log" aria-label="Conversation" aria-busy={isTyping}>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex max-w-[96%] min-w-0 flex-col gap-2 ${message.role === "user" ? "items-end" : "items-start"}`}>
                  <p className={`m-0 max-w-full whitespace-pre-line rounded-2xl px-3 py-2.5 text-[11px] leading-relaxed ${message.role === "user" ? "rounded-br-sm border border-rose-700 bg-rose-600 text-white" : "rounded-bl-sm border border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}>{message.text}</p>
                  {message.actions?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {message.actions.map((action, index) => (
                        <button
                          key={message.id + "-" + index}
                          type="button"
                          onClick={() => runAction(action)}
                          disabled={isTyping}
                          className="max-w-full rounded-full border border-rose-700/25 bg-rose-50 px-2.5 py-2 text-left text-[9px] font-bold text-rose-800 transition hover:-translate-y-px hover:border-orange-500/50 hover:bg-orange-50 disabled:cursor-default disabled:opacity-60 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200 dark:hover:bg-rose-900"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-px">
                {quickQuestions.map((question) => (
                  <button key={question} className="rounded-full border border-slate-300 bg-white dark:bg-slate-900 px-2.5 py-2 text-[9px] font-bold text-rose-800 transition hover:border-rose-500 hover:bg-rose-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-rose-300 dark:hover:bg-slate-700" type="button" onClick={() => sendMessage(question)} disabled={isTyping}>
                    {question}
                  </button>
                ))}
              </div>
            )}
            {isTyping && (
              <p className="m-0 animate-pulse self-start text-[10px] text-rose-800 dark:text-rose-300">Checking the store...</p>
            )}
            <div ref={endRef} />
          </div>

          <div className="flex gap-2 bg-white px-4 pb-3 dark:bg-slate-900">
            <button className="rounded-full border border-slate-300 bg-white dark:bg-slate-900 px-2.5 py-2 text-[9px] font-bold text-rose-800 hover:bg-rose-50 dark:border-slate-700 dark:bg-slate-800 dark:text-rose-300 dark:hover:bg-slate-700" type="button" onClick={() => goTo("/fetch-products")}>Browse products</button>
            <button className="rounded-full border border-slate-300 bg-white dark:bg-slate-900 px-2.5 py-2 text-[9px] font-bold text-rose-800 hover:bg-rose-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-rose-300 dark:hover:bg-slate-700" type="button" onClick={() => sendMessage("Show my cart")} disabled={isTyping}>View cart</button>
          </div>

          <form
            className="mx-3 mb-3 flex items-center gap-2 rounded-full border border-slate-300 bg-white dark:bg-slate-900 p-1.5 pl-3 focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-500/10 dark:border-slate-700 dark:bg-slate-950"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <input
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Find, order, or ask…"
              aria-label="Message the shopping assistant"
              maxLength={250}
              disabled={isTyping}
              className="w-full min-w-0 border-0 bg-transparent text-[11px] text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-60 dark:text-slate-100"
            />
            <button
              type="button"
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-white transition hover:brightness-110 disabled:cursor-default disabled:opacity-50 ${isListening ? "bg-red-600" : "bg-rose-700"}`}
              onClick={toggleVoiceInput}
              aria-label={isListening ? "Stop voice input" : "Start voice input"}
              aria-pressed={isListening}
              title={isListening ? "Stop listening" : "Speak your request"}
              disabled={isTyping}
            >
              {isListening ? <StopIcon className="h-4 w-4" aria-hidden="true" /> : <MicrophoneIcon className="h-4 w-4" aria-hidden="true" />}
            </button>
            <button type="submit" aria-label="Send message" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-rose-700 text-white transition hover:bg-rose-800 disabled:cursor-default disabled:bg-slate-300" disabled={!draft.trim() || isTyping}>
              <PaperAirplaneIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </section>
      )}

      <button
        className={`group relative flex h-[58px] w-[58px] items-center justify-start overflow-hidden rounded-full border border-rose-400/60 bg-rose-700 p-0 text-white shadow-xl shadow-slate-950/25 transition-[width,transform,background-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:bg-rose-800 hover:shadow-2xl hover:shadow-rose-950/35 focus-visible:-translate-y-1 focus-visible:bg-rose-800 max-sm:h-[52px] max-sm:w-[52px] max-sm:hover:w-[52px] max-sm:focus-visible:w-[52px] ${isOpen ? "focus-visible:w-[58px]" : "hover:w-[224px] focus-visible:w-[224px]"}`}
        type="button"
        onClick={handleLauncherClick}
        aria-label={isOpen ? "Close voice shopping agent" : "Open voice shopping agent and start listening"}
        aria-expanded={isOpen}
      >
        <span className="grid h-[56px] w-[56px] shrink-0 place-items-center max-sm:h-[50px] max-sm:w-[50px]">
          {isOpen ? (
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <MicrophoneIcon className="h-5 w-5 group-hover:animate-chat-launcher-squeeze group-focus-visible:animate-chat-launcher-squeeze" aria-hidden="true" />
          )}
        </span>
        {!isOpen && (
          <span className="max-w-0 translate-x-1 overflow-hidden whitespace-nowrap text-[11px] font-bold opacity-0 transition-[max-width,opacity,transform] duration-300 group-hover:max-w-[145px] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:max-w-[145px] group-focus-visible:translate-x-0 group-focus-visible:opacity-100 max-sm:hidden">
            Talk to Aura &amp; Ember
          </span>
        )}
        {!isOpen && <span className="pointer-events-none absolute right-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-rose-700 bg-orange-400 shadow-sm" aria-hidden="true" />}
      </button>
    </div>
  );
}
