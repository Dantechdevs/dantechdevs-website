"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", contact: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content:
                "Hi! I'm the Dantechdevs AI assistant. How can I help you today? Ask me about our services, pricing, or anything else!",
        },
    ]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const sendMessage = async () => {
        if (!userInput.trim() || loading) return;
        const newMessages: Message[] = [
            ...messages,
            { role: "user", content: userInput },
        ];
        setMessages(newMessages);
        setUserInput("");
        setLoading(true);

        try {
            const res = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 1000,
                    system:
                        "You are a helpful assistant for Dantechdevs, a software development company based in Nairobi, Kenya. You help visitors with questions about services (web development, mobile apps, custom software, UI/UX design), pricing, timelines, and general inquiries. Be friendly, concise, and professional. If asked for contact info: phone 0712328150, email dantechdevs@gmail.com.",
                    messages: newMessages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });
            const data = await res.json();
            const reply =
                data.content?.[0]?.text ?? "Sorry, I couldn't get a response.";
            setMessages([...newMessages, { role: "assistant", content: reply }]);
        } catch {
            setMessages([
                ...newMessages,
                {
                    role: "assistant",
                    content: "Sorry, something went wrong. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main
            style={{
                minHeight: "100vh",
                background: "#0d1117",
                color: "#ffffff",
                fontFamily: "sans-serif",
            }}
        >
            {/* Hero */}
            <section
                style={{
                    textAlign: "center",
                    padding: "80px 24px 40px",
                    borderBottom: "1px solid #1e2530",
                }}
            >
                <span
                    style={{
                        display: "inline-block",
                        border: "1px solid #e8a020",
                        color: "#e8a020",
                        borderRadius: "999px",
                        padding: "6px 20px",
                        fontSize: "14px",
                        marginBottom: "24px",
                    }}
                >
                    Get in Touch
                </span>
                <h1
                    style={{
                        fontSize: "clamp(2rem, 5vw, 3.5rem)",
                        fontWeight: 700,
                        margin: "0 0 16px",
                        lineHeight: 1.15,
                    }}
                >
                    Ready to{" "}
                    <span style={{ color: "#e8a020" }}>get started?</span>
                </h1>
                <p style={{ color: "#8b949e", fontSize: "18px", margin: 0 }}>
                    Reach out and we&apos;ll get your business running on the right
                    software.
                </p>
                <div
                    style={{
                        width: "60px",
                        height: "3px",
                        background: "#e8a020",
                        margin: "24px auto 0",
                        borderRadius: "2px",
                    }}
                />
            </section>

            {/* Body */}
            <section
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                    padding: "60px 24px 100px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "60px",
                    alignItems: "start",
                }}
                className="contact-grid"
            >
                {/* Contact Details */}
                <div>
                    <h2
                        style={{
                            fontSize: "22px",
                            fontWeight: 700,
                            marginBottom: "32px",
                        }}
                    >
                        Contact Details
                    </h2>

                    {[
                        {
                            icon: "📍",
                            label: "LOCATION",
                            value: "Nairobi, Kenya",
                            href: null,
                        },
                        {
                            icon: "✉️",
                            label: "EMAIL",
                            value: "dantechdevs@gmail.com",
                            href: "mailto:dantechdevs@gmail.com",
                        },
                        {
                            icon: "📞",
                            label: "PHONE / WHATSAPP",
                            value: "0712 328 150",
                            href: "tel:+254712328150",
                        },
                    ].map((item) => (
                        <div
                            key={item.label}
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "16px",
                                marginBottom: "28px",
                            }}
                        >
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    background: "#1e2530",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "20px",
                                    flexShrink: 0,
                                }}
                            >
                                {item.icon}
                            </div>
                            <div>
                                <p
                                    style={{
                                        fontSize: "11px",
                                        color: "#8b949e",
                                        letterSpacing: "0.1em",
                                        margin: "0 0 4px",
                                    }}
                                >
                                    {item.label}
                                </p>
                                {item.href ? (
                                    <a
                                        href={item.href}
                                        style={{
                                            color: "#ffffff",
                                            fontSize: "16px",
                                            textDecoration: "none",
                                        }}
                                    >
                                        {item.value}
                                    </a>
                                ) : (
                                    <p style={{ color: "#ffffff", fontSize: "16px", margin: 0 }}>
                                        {item.value}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* WhatsApp Button */}
                    <a
                        href="https://wa.me/254712328150?text=Hi%20Dantechdevs%2C%20I%27d%20like%20to%20inquire%20about%20your%20services."
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "10px",
                            background: "#25D366",
                            color: "#ffffff",
                            padding: "14px 28px",
                            borderRadius: "999px",
                            fontWeight: 600,
                            fontSize: "16px",
                            textDecoration: "none",
                            marginTop: "8px",
                            transition: "opacity 0.2s",
                        }}
                        onMouseOver={(e) =>
                            ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.85")
                        }
                        onMouseOut={(e) =>
                            ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")
                        }
                    >
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Chat on WhatsApp
                    </a>
                </div>

                {/* Contact Form */}
                <div
                    style={{
                        background: "#161b22",
                        border: "1px solid #1e2530",
                        borderRadius: "16px",
                        padding: "36px",
                    }}
                >
                    {submitted ? (
                        <div style={{ textAlign: "center", padding: "40px 0" }}>
                            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
                            <h3
                                style={{
                                    fontSize: "20px",
                                    fontWeight: 700,
                                    marginBottom: "8px",
                                }}
                            >
                                Message Sent!
                            </h3>
                            <p style={{ color: "#8b949e" }}>
                                We&apos;ll get back to you as soon as possible.
                            </p>
                            <button
                                onClick={() => {
                                    setSubmitted(false);
                                    setForm({ name: "", contact: "", message: "" });
                                }}
                                style={{
                                    marginTop: "20px",
                                    background: "transparent",
                                    border: "1px solid #e8a020",
                                    color: "#e8a020",
                                    padding: "10px 24px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                }}
                            >
                                Send another
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2
                                style={{
                                    fontSize: "20px",
                                    fontWeight: 700,
                                    marginBottom: "28px",
                                }}
                            >
                                Send us a message
                            </h2>
                            <form
                                onSubmit={handleSubmit}
                                style={{ display: "flex", flexDirection: "column", gap: "20px" }}
                            >
                                <div>
                                    <label
                                        style={{
                                            fontSize: "13px",
                                            color: "#8b949e",
                                            display: "block",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Daniel Kamau"
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm({ ...form, name: e.target.value })
                                        }
                                        style={{
                                            width: "100%",
                                            background: "#0d1117",
                                            border: "1px solid #1e2530",
                                            borderRadius: "8px",
                                            padding: "12px 16px",
                                            color: "#ffffff",
                                            fontSize: "15px",
                                            outline: "none",
                                            boxSizing: "border-box",
                                        }}
                                    />
                                </div>
                                <div>
                                    <label
                                        style={{
                                            fontSize: "13px",
                                            color: "#8b949e",
                                            display: "block",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        Email or Phone
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="your@email.com or 07XXXXXXXX"
                                        value={form.contact}
                                        onChange={(e) =>
                                            setForm({ ...form, contact: e.target.value })
                                        }
                                        style={{
                                            width: "100%",
                                            background: "#0d1117",
                                            border: "1px solid #1e2530",
                                            borderRadius: "8px",
                                            padding: "12px 16px",
                                            color: "#ffffff",
                                            fontSize: "15px",
                                            outline: "none",
                                            boxSizing: "border-box",
                                        }}
                                    />
                                </div>
                                <div>
                                    <label
                                        style={{
                                            fontSize: "13px",
                                            color: "#8b949e",
                                            display: "block",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        Your Message
                                    </label>
                                    <textarea
                                        required
                                        rows={5}
                                        placeholder="Tell us about your project..."
                                        value={form.message}
                                        onChange={(e) =>
                                            setForm({ ...form, message: e.target.value })
                                        }
                                        style={{
                                            width: "100%",
                                            background: "#0d1117",
                                            border: "1px solid #1e2530",
                                            borderRadius: "8px",
                                            padding: "12px 16px",
                                            color: "#ffffff",
                                            fontSize: "15px",
                                            outline: "none",
                                            resize: "vertical",
                                            boxSizing: "border-box",
                                            fontFamily: "inherit",
                                        }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    style={{
                                        background: "#e8a020",
                                        color: "#0d1117",
                                        border: "none",
                                        borderRadius: "8px",
                                        padding: "14px",
                                        fontSize: "16px",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        transition: "opacity 0.2s",
                                    }}
                                    onMouseOver={(e) =>
                                    ((e.currentTarget as HTMLButtonElement).style.opacity =
                                        "0.85")
                                    }
                                    onMouseOut={(e) =>
                                        ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
                                    }
                                >
                                    Send Message
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </section>

            {/* AI Chat Widget */}
            <div
                style={{
                    position: "fixed",
                    bottom: "28px",
                    right: "28px",
                    zIndex: 1000,
                }}
            >
                {chatOpen && (
                    <div
                        style={{
                            width: "360px",
                            height: "480px",
                            background: "#161b22",
                            border: "1px solid #1e2530",
                            borderRadius: "16px",
                            display: "flex",
                            flexDirection: "column",
                            marginBottom: "16px",
                            overflow: "hidden",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                        }}
                    >
                        {/* Chat Header */}
                        <div
                            style={{
                                background: "#e8a020",
                                padding: "16px 20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div
                                    style={{
                                        width: "36px",
                                        height: "36px",
                                        background: "rgba(0,0,0,0.15)",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "18px",
                                    }}
                                >
                                    🤖
                                </div>
                                <div>
                                    <p
                                        style={{
                                            margin: 0,
                                            fontWeight: 700,
                                            color: "#0d1117",
                                            fontSize: "14px",
                                        }}
                                    >
                                        Dantechdevs AI
                                    </p>
                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize: "11px",
                                            color: "rgba(13,17,23,0.7)",
                                        }}
                                    >
                                        Online • Replies instantly
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setChatOpen(false)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#0d1117",
                                    fontSize: "20px",
                                    cursor: "pointer",
                                    lineHeight: 1,
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            style={{
                                flex: 1,
                                overflowY: "auto",
                                padding: "16px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                            }}
                        >
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        justifyContent:
                                            msg.role === "user" ? "flex-end" : "flex-start",
                                    }}
                                >
                                    <div
                                        style={{
                                            maxWidth: "80%",
                                            background:
                                                msg.role === "user" ? "#e8a020" : "#1e2530",
                                            color: msg.role === "user" ? "#0d1117" : "#ffffff",
                                            borderRadius:
                                                msg.role === "user"
                                                    ? "16px 16px 4px 16px"
                                                    : "16px 16px 16px 4px",
                                            padding: "10px 14px",
                                            fontSize: "14px",
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div style={{ display: "flex", gap: "4px", padding: "8px" }}>
                                    {[0, 1, 2].map((i) => (
                                        <div
                                            key={i}
                                            style={{
                                                width: "8px",
                                                height: "8px",
                                                background: "#e8a020",
                                                borderRadius: "50%",
                                                animation: `bounce 1s ${i * 0.2}s infinite`,
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <div
                            style={{
                                padding: "12px 16px",
                                borderTop: "1px solid #1e2530",
                                display: "flex",
                                gap: "8px",
                            }}
                        >
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Ask a question..."
                                style={{
                                    flex: 1,
                                    background: "#0d1117",
                                    border: "1px solid #1e2530",
                                    borderRadius: "8px",
                                    padding: "10px 14px",
                                    color: "#ffffff",
                                    fontSize: "14px",
                                    outline: "none",
                                }}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading}
                                style={{
                                    background: "#e8a020",
                                    border: "none",
                                    borderRadius: "8px",
                                    width: "40px",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    fontSize: "18px",
                                    opacity: loading ? 0.5 : 1,
                                }}
                            >
                                ➤
                            </button>
                        </div>
                    </div>
                )}

                {/* Toggle Button */}
                <button
                    onClick={() => setChatOpen(!chatOpen)}
                    style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "#e8a020",
                        border: "none",
                        fontSize: "26px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 20px rgba(232,160,32,0.4)",
                        transition: "transform 0.2s",
                    }}
                    onMouseOver={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(1.1)")
                    }
                    onMouseOut={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")
                    }
                    title="Chat with AI"
                >
                    {chatOpen ? "×" : "🤖"}
                </button>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
      `}</style>
        </main>
    );
}