import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import { prisma } from "../../../lib/prisma";
import { getStoreProducts } from "../../../lib/store-products";

type Action = { label: string; href: string };
type ChatReply = { reply: string; actions?: Action[]; suggestions?: string[] };

const defaultSuggestions = ["Track my latest order", "Delivery information", "Recommend a plant", "Return policy"];

function answer(reply: string, actions?: Action[], suggestions = defaultSuggestions) {
  return NextResponse.json({ reply, actions, suggestions } satisfies ChatReply);
}

function orderStatusText(status: string) {
  const messages: Record<string, string> = {
    PENDING: "Your order was received and is waiting for confirmation.",
    CONFIRMED: "Your order is confirmed and is being prepared.",
    SHIPPED: "Your order has been shipped and is on its way.",
    DELIVERED: "Your order has been delivered.",
    CANCELLED: "This order was cancelled.",
  };
  return messages[status] ?? `The current order status is ${status}.`;
}

async function replyWithOrder(orderId: number | null, userId: number, isAdmin: boolean) {
  const order = await prisma.order.findFirst({
    where: orderId ? { id: orderId, ...(isAdmin ? {} : { userId }) } : { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  if (!order) return answer(orderId ? `I could not find order #${orderId} in your account. Check the number or contact support.` : "There are no orders in your account yet.", [{ label: "Contact support", href: "/contact" }]);
  const itemSummary = order.items.slice(0, 3).map((item) => `${item.productName} × ${item.quantity}`).join(", ");
  const remaining = order.items.length > 3 ? ` and ${order.items.length - 3} more item(s)` : "";
  return answer(`Order #${order.id}: ${orderStatusText(order.status)} Total ₹${Number(order.total).toFixed(2)}. Items: ${itemSummary}${remaining}. Ordered on ${order.createdAt.toLocaleDateString("en-IN")}.`, [{ label: "Order help", href: "/contact" }], ["Track another order", "Shipping policy", "Contact support"]);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { message?: unknown };
  const original = String(body.message ?? "").trim().slice(0, 500);
  const message = original.toLowerCase();
  if (!message) return answer("Please type a question or choose one of the suggestions below.");

  const wantsOrder = /\b(order|track|tracking|shipment|where is my order)\b/.test(message);
  if (wantsOrder) {
    const session = await auth();
    if (!session?.user?.id) return answer("Please sign in first. For your privacy, I can only show orders belonging to the signed-in account.", [{ label: "Sign in", href: "/login" }], ["Delivery information", "Payment options", "Contact support"]);
    const orderNumber = message.match(/(?:order|track|#)\s*#?\s*(\d+)/)?.[1];
    return replyWithOrder(orderNumber ? Number(orderNumber) : null, Number(session.user.id), session.user.role === "ADMIN");
  }

  if (/\b(delivery|shipping|dispatch|arrive|courier|pin code)\b/.test(message)) return answer("Orders are usually dispatched within 2–3 working days. Delivery time and charges depend on your PIN code and are confirmed during checkout.", [{ label: "Shipping details", href: "/shipping" }]);
  if (/\b(return|refund|replace|damaged|dead plant|broken)\b/.test(message)) return answer("If a plant arrives damaged or unhealthy, photograph the plant and packaging promptly and contact PlantCare support with your order number. Eligibility follows the published return policy.", [{ label: "Return policy", href: "/returns" }, { label: "Contact support", href: "/contact" }]);
  if (/\b(payment|cod|cash|card|upi)\b/.test(message)) return answer("The current checkout supports cash on delivery. The website does not collect or store card numbers or CVV details.", [{ label: "Go to cart", href: "/cart" }]);
  if (/\b(water|watering|yellow leaves|sunlight|plant care|fertilizer|pest)\b/.test(message)) return answer("Check the top 2–3 cm of soil before watering, avoid standing water and match the plant to its recommended light. For a specific problem, include the plant name and symptoms when contacting support.", [{ label: "Plant-care guides", href: "/blog" }]);
  if (/\b(contact|human|person|support|phone|email)\b/.test(message)) return answer("You can send the PlantCare team your question through the contact page. Include your order number for order-related support, but never send passwords or card details.", [{ label: "Contact PlantCare", href: "/contact" }]);

  if (/\b(recommend|suggest|beginner|indoor|balcony|flower|fruit|herb|vegetable|planter|seed)\b/.test(message)) {
    const products = await getStoreProducts();
    const stopWords = new Set(["recommend", "suggest", "please", "plant", "plants", "for", "the", "and", "want", "need", "best", "good"]);
    const terms = message.split(/[^a-z0-9-]+/).filter((term) => term.length > 2 && !stopWords.has(term));
    const matches = products.filter((product) => terms.some((term) => `${product.name} ${product.category}`.toLowerCase().includes(term))).slice(0, 3);
    const selected = matches.length ? matches : products.slice(0, 3);
    return answer(`Here are a few catalogue options: ${selected.map((product) => `${product.name} (₹${product.price})`).join(", ")}. Open the collection to compare them.`, [{ label: "Browse recommended products", href: "/products" }], ["Indoor plant care", "Show flower plants", "Delivery information"]);
  }

  if (/\b(hello|hi|hey|help)\b/.test(message)) return answer("Hello! I can help with products, plant care, delivery, returns, payment questions and secure order tracking. What would you like to know?");
  return answer("I can help with product recommendations, plant care, delivery, returns, payments and order tracking. For a question that needs the PlantCare team, please use the contact page.", [{ label: "Contact support", href: "/contact" }]);
}
