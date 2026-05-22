"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        contact: "",
        message: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        contact: "",
        message: "",
    });

    const [sending, setSending] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [chatOpen, setChatOpen] = useState(false);

    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content:
                "Hi 👋 I'm the Dantechdevs AI assistant. Ask me about pricing, websites, mobile apps, timelines, or UI/UX design.",
        },
    ]);

    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setChatOpen(false);
            }
        };

        window.addEventListener("keydown", handleEsc);

        return () => {
            window.removeEventListener(
                "keydown",
                handleEsc
            );
        };
    }, []);

    const validateForm = () => {
        const newErrors = {
            name: "",
            contact: "",
            message: "",
        };

        if (form.name.trim().length < 2) {
            newErrors.name =
                "Please enter a valid name";
        }

        if (
            !form.contact.includes("@") &&
            !/^(\+254|0)[17]\d{8}$/.test(
                form.contact
            )
        ) {
            newErrors.contact =
                "Enter a valid email or Kenyan phone number";
        }

        if (form.message.trim().length < 10) {
            newErrors.message =
                "Message should be at least 10 characters";
        }

        setErrors(newErrors);

        return !Object.values(newErrors).some(
            Boolean
        );
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (!validateForm()) return;

        setSending(true);

        await new Promise((resolve) =>
            setTimeout(resolve, 1500)
        );

        setSending(false);
        setSubmitted(true);
    };

    const sendMessage = async () => {
        if (!userInput.trim() || loading)
            return;

        const newMessages: Message[] = [
            ...messages,
            {
                role: "user",
                content: userInput,
            },
        ];

        setMessages(newMessages);
        setUserInput("");
        setLoading(true);

        setTimeout(() => {
            setMessages([
                ...newMessages,
                {
                    role: "assistant",
                    content:
                        "Thanks for reaching out 👋 Dantechdevs specializes in websites, mobile apps, UI/UX, and custom software solutions.",
                },
            ]);

            setLoading(false);
        }, 1200);
    };

    const suggestions = [
        "Website pricing",
        "Do you build mobile apps?",
        "How long does a project take?",
    ];

    return (
        <main
            style={{
                minHeight: "100vh",
                background: "#0d1117",
                color: "#ffffff",
                fontFamily: "sans-serif",
            }}
        >
            {/* HERO */}
            <section
                style={{
                    textAlign: "center",
                    padding: "90px 24px 60px",
                    borderBottom:
                        "1px solid #1e2530",
                    animation:
                        "fadeUp 0.7s ease",
                }}
            >
                <span
                    style={{
                        display: "inline-block",
                        border:
                            "1px solid #e8a020",
                        color: "#e8a020",
                        borderRadius: "999px",
                        padding: "8px 18px",
                        fontSize: "14px",
                        marginBottom: "26px",
                    }}
                >
                    Available for Projects
                </span>

                <h1
                    style={{
                        fontSize:
                            "clamp(2.5rem, 6vw, 4.5rem)",
                        fontWeight: 700,
                        lineHeight: 1.1,
                        marginBottom: "20px",
                    }}
                >
                    Let&apos;s Build Something{" "}
                    <span
                        style={{
                            color: "#e8a020",
                        }}
                    >
                        Amazing
                    </span>
                </h1>

                <p
                    style={{
                        maxWidth: "700px",
                        margin: "0 auto",
                        color: "#8b949e",
                        fontSize: "18px",
                        lineHeight: 1.7,
                    }}
                >
                    We help businesses and startups
                    create modern websites, mobile
                    apps, and scalable software
                    systems.
                </p>
            </section>

            {/* CONTACT SECTION */}
            <section
                className="contact-grid"
                style={{
                    maxWidth: "1150px",
                    margin: "0 auto",
                    padding: "80px 24px",
                    display: "grid",
                    gridTemplateColumns:
                        "1fr 1fr",
                    gap: "60px",
                }}
            >
                {/* LEFT SIDE */}
                <div
                    style={{
                        animation:
                            "fadeUp 0.8s ease",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "28px",
                            marginBottom: "35px",
                        }}
                    >
                        Contact Details
                    </h2>

                    {[
                        {
                            icon: "📍",
                            title: "Location",
                            value: "Nairobi, Kenya",
                        },
                        {
                            icon: "✉️",
                            title: "Email",
                            value: "dantechdevs@gmail.com",
                        },
                        {
                            icon: "📞",
                            title: "Phone",
                            value: "+254 712 328 150",
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            style={{
                                display: "flex",
                                gap: "18px",
                                marginBottom: "28px",
                            }}
                        >
                            <div
                                style={{
                                    width: "56px",
                                    height: "56px",
                                    background:
                                        "#161b22",
                                    borderRadius:
                                        "16px",
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    fontSize: "24px",
                                    border:
                                        "1px solid #1e2530",
                                }}
                            >
                                {item.icon}
                            </div>

                            <div>
                                <p
                                    style={{
                                        color:
                                            "#8b949e",
                                        fontSize:
                                            "12px",
                                        textTransform:
                                            "uppercase",
                                        letterSpacing:
                                            "0.08em",
                                        marginBottom:
                                            "6px",
                                    }}
                                >
                                    {item.title}
                                </p>

                                <p
                                    style={{
                                        margin: 0,
                                        fontSize:
                                            "18px",
                                    }}
                                >
                                    {item.value}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* WHATSAPP */}
                    <a
                        href="https://wa.me/254712328150"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display:
                                "inline-flex",
                            alignItems: "center",
                            gap: "10px",
                            background: "#25D366",
                            color: "#fff",
                            padding:
                                "14px 26px",
                            borderRadius:
                                "999px",
                            textDecoration:
                                "none",
                            fontWeight: 700,
                            marginTop: "10px",
                            transition:
                                "all 0.3s ease",
                        }}
                    >
                        💬 Chat on WhatsApp
                    </a>

                    {/* SOCIAL ICONS */}
                    <div
                        style={{
                            display: "flex",
                            gap: "14px",
                            marginTop: "34px",
                            flexWrap: "wrap",
                        }}
                    >
                        {[
                            {
                                icon: "🌐",
                                label: "Website",
                            },
                            {
                                icon: "💼",
                                label: "LinkedIn",
                            },
                            {
                                icon: "💻",
                                label: "GitHub",
                            },
                            {
                                icon: "📘",
                                label: "Facebook",
                            },
                        ].map((social) => (
                            <button
                                key={social.label}
                                style={{
                                    width: "52px",
                                    height: "52px",
                                    background:
                                        "#161b22",
                                    border:
                                        "1px solid #1e2530",
                                    borderRadius:
                                        "14px",
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    fontSize:
                                        "22px",
                                    cursor:
                                        "pointer",
                                    transition:
                                        "all 0.25s ease",
                                }}
                                onMouseOver={(
                                    e
                                ) => {
                                    e.currentTarget.style.transform =
                                        "translateY(-5px)";
                                    e.currentTarget.style.border =
                                        "1px solid #e8a020";
                                }}
                                onMouseOut={(
                                    e
                                ) => {
                                    e.currentTarget.style.transform =
                                        "translateY(0)";
                                    e.currentTarget.style.border =
                                        "1px solid #1e2530";
                                }}
                            >
                                {social.icon}
                            </button>
                        ))}
                    </div>

                    {/* STATS */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "1fr 1fr",
                            gap: "16px",
                            marginTop: "45px",
                        }}
                    >
                        {[
                            "50+ Projects",
                            "Fast Delivery",
                            "24/7 Support",
                            "Modern UI/UX",
                        ].map((item) => (
                            <div
                                key={item}
                                style={{
                                    background:
                                        "#161b22",
                                    border:
                                        "1px solid #1e2530",
                                    borderRadius:
                                        "16px",
                                    padding:
                                        "22px",
                                    textAlign:
                                        "center",
                                }}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div
                    style={{
                        background: "#161b22",
                        border:
                            "1px solid #1e2530",
                        borderRadius: "24px",
                        padding: "40px",
                        animation:
                            "fadeUp 1s ease",
                    }}
                >
                    {submitted ? (
                        <div
                            style={{
                                textAlign:
                                    "center",
                                padding:
                                    "40px 0",
                            }}
                        >
                            <div
                                style={{
                                    fontSize:
                                        "64px",
                                    marginBottom:
                                        "20px",
                                }}
                            >
                                ✅
                            </div>

                            <h2>
                                Message Sent!
                            </h2>

                            <p
                                style={{
                                    color:
                                        "#8b949e",
                                }}
                            >
                                We&apos;ll get
                                back to you
                                shortly.
                            </p>

                            <button
                                onClick={() => {
                                    setSubmitted(
                                        false
                                    );

                                    setForm({
                                        name: "",
                                        contact:
                                            "",
                                        message:
                                            "",
                                    });
                                }}
                                style={{
                                    marginTop:
                                        "24px",
                                    background:
                                        "transparent",
                                    border:
                                        "1px solid #e8a020",
                                    color:
                                        "#e8a020",
                                    padding:
                                        "12px 24px",
                                    borderRadius:
                                        "10px",
                                    cursor:
                                        "pointer",
                                }}
                            >
                                Send Another
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2
                                style={{
                                    marginBottom:
                                        "28px",
                                    fontSize:
                                        "28px",
                                }}
                            >
                                Send us a
                                message
                            </h2>

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                                style={{
                                    display:
                                        "flex",
                                    flexDirection:
                                        "column",
                                    gap: "22px",
                                }}
                            >
                                {/* NAME */}
                                <div>
                                    <label
                                        style={{
                                            display:
                                                "block",
                                            marginBottom:
                                                "8px",
                                            color:
                                                "#8b949e",
                                            fontSize:
                                                "13px",
                                        }}
                                    >
                                        Your Name
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            form.name
                                        }
                                        placeholder="John Doe"
                                        onChange={(
                                            e
                                        ) =>
                                            setForm(
                                                {
                                                    ...form,
                                                    name: e
                                                        .target
                                                        .value,
                                                }
                                            )
                                        }
                                        style={{
                                            width:
                                                "100%",
                                            background:
                                                "#0d1117",
                                            border:
                                                "1px solid #1e2530",
                                            borderRadius:
                                                "12px",
                                            padding:
                                                "15px 16px",
                                            color:
                                                "#fff",
                                            outline:
                                                "none",
                                            boxSizing:
                                                "border-box",
                                        }}
                                    />

                                    {errors.name && (
                                        <p
                                            style={{
                                                color:
                                                    "#ff6b6b",
                                                fontSize:
                                                    "13px",
                                                marginTop:
                                                    "8px",
                                            }}
                                        >
                                            {
                                                errors.name
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* CONTACT */}
                                <div>
                                    <label
                                        style={{
                                            display:
                                                "block",
                                            marginBottom:
                                                "8px",
                                            color:
                                                "#8b949e",
                                            fontSize:
                                                "13px",
                                        }}
                                    >
                                        Email or
                                        Phone
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            form.contact
                                        }
                                        placeholder="you@email.com"
                                        onChange={(
                                            e
                                        ) =>
                                            setForm(
                                                {
                                                    ...form,
                                                    contact:
                                                        e
                                                            .target
                                                            .value,
                                                }
                                            )
                                        }
                                        style={{
                                            width:
                                                "100%",
                                            background:
                                                "#0d1117",
                                            border:
                                                "1px solid #1e2530",
                                            borderRadius:
                                                "12px",
                                            padding:
                                                "15px 16px",
                                            color:
                                                "#fff",
                                            outline:
                                                "none",
                                            boxSizing:
                                                "border-box",
                                        }}
                                    />

                                    {errors.contact && (
                                        <p
                                            style={{
                                                color:
                                                    "#ff6b6b",
                                                fontSize:
                                                    "13px",
                                                marginTop:
                                                    "8px",
                                            }}
                                        >
                                            {
                                                errors.contact
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* MESSAGE */}
                                <div>
                                    <label
                                        style={{
                                            display:
                                                "block",
                                            marginBottom:
                                                "8px",
                                            color:
                                                "#8b949e",
                                            fontSize:
                                                "13px",
                                        }}
                                    >
                                        Message
                                    </label>

                                    <textarea
                                        rows={6}
                                        maxLength={
                                            500
                                        }
                                        value={
                                            form.message
                                        }
                                        placeholder="Tell us about your project..."
                                        onChange={(
                                            e
                                        ) =>
                                            setForm(
                                                {
                                                    ...form,
                                                    message:
                                                        e
                                                            .target
                                                            .value,
                                                }
                                            )
                                        }
                                        style={{
                                            width:
                                                "100%",
                                            background:
                                                "#0d1117",
                                            border:
                                                "1px solid #1e2530",
                                            borderRadius:
                                                "12px",
                                            padding:
                                                "15px 16px",
                                            color:
                                                "#fff",
                                            outline:
                                                "none",
                                            resize:
                                                "vertical",
                                            boxSizing:
                                                "border-box",
                                            fontFamily:
                                                "sans-serif",
                                        }}
                                    />

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                "space-between",
                                            marginTop:
                                                "8px",
                                        }}
                                    >
                                        {errors.message ? (
                                            <p
                                                style={{
                                                    color:
                                                        "#ff6b6b",
                                                    fontSize:
                                                        "13px",
                                                }}
                                            >
                                                {
                                                    errors.message
                                                }
                                            </p>
                                        ) : (
                                            <span />
                                        )}

                                        <p
                                            style={{
                                                color:
                                                    "#8b949e",
                                                fontSize:
                                                    "12px",
                                            }}
                                        >
                                            {
                                                form
                                                    .message
                                                    .length
                                            }
                                            /500
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={
                                        sending
                                    }
                                    style={{
                                        background:
                                            "#e8a020",
                                        color:
                                            "#0d1117",
                                        border:
                                            "none",
                                        borderRadius:
                                            "12px",
                                        padding:
                                            "16px",
                                        fontSize:
                                            "16px",
                                        fontWeight: 700,
                                        cursor:
                                            sending
                                                ? "not-allowed"
                                                : "pointer",
                                        opacity:
                                            sending
                                                ? 0.7
                                                : 1,
                                    }}
                                >
                                    {sending
                                        ? "Sending..."
                                        : "Send Message"}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </section>

            {/* SERVICES */}
            <section
                style={{
                    maxWidth: "1150px",
                    margin: "0 auto",
                    padding:
                        "0 24px 100px",
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "50px",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "38px",
                            marginBottom: "16px",
                        }}
                    >
                        What We Build
                    </h2>

                    <p
                        style={{
                            color: "#8b949e",
                            maxWidth: "700px",
                            margin: "0 auto",
                            lineHeight: 1.7,
                        }}
                    >
                        Modern digital
                        solutions designed
                        for startups,
                        businesses, and
                        growing brands.
                    </p>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "24px",
                    }}
                >
                    {[
                        {
                            icon: "🌐",
                            title:
                                "Web Development",
                            desc: "Modern responsive websites and web apps.",
                        },
                        {
                            icon: "📱",
                            title:
                                "Mobile Apps",
                            desc: "Android and iOS applications.",
                        },
                        {
                            icon: "🎨",
                            title:
                                "UI/UX Design",
                            desc: "Beautiful interfaces and user experiences.",
                        },
                        {
                            icon: "⚙️",
                            title:
                                "Custom Software",
                            desc: "Tailored systems for businesses.",
                        },
                    ].map((service) => (
                        <div
                            key={
                                service.title
                            }
                            style={{
                                background:
                                    "#161b22",
                                border:
                                    "1px solid #1e2530",
                                borderRadius:
                                    "22px",
                                padding:
                                    "30px",
                                transition:
                                    "all 0.3s ease",
                                cursor:
                                    "pointer",
                            }}
                            onMouseOver={(
                                e
                            ) => {
                                e.currentTarget.style.transform =
                                    "translateY(-8px)";
                                e.currentTarget.style.border =
                                    "1px solid #e8a020";
                            }}
                            onMouseOut={(
                                e
                            ) => {
                                e.currentTarget.style.transform =
                                    "translateY(0)";
                                e.currentTarget.style.border =
                                    "1px solid #1e2530";
                            }}
                        >
                            <div
                                style={{
                                    fontSize:
                                        "42px",
                                    marginBottom:
                                        "18px",
                                }}
                            >
                                {
                                    service.icon
                                }
                            </div>

                            <h3
                                style={{
                                    fontSize:
                                        "22px",
                                    marginBottom:
                                        "14px",
                                }}
                            >
                                {
                                    service.title
                                }
                            </h3>

                            <p
                                style={{
                                    color:
                                        "#8b949e",
                                    lineHeight:
                                        1.7,
                                }}
                            >
                                {
                                    service.desc
                                }
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section
                style={{
                    maxWidth: "900px",
                    margin: "0 auto",
                    padding:
                        "0 24px 120px",
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "50px",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "36px",
                            marginBottom: "14px",
                        }}
                    >
                        Frequently Asked
                        Questions
                    </h2>

                    <p
                        style={{
                            color: "#8b949e",
                        }}
                    >
                        Common questions
                        clients ask us.
                    </p>
                </div>

                {[
                    {
                        q: "How long does a website take?",
                        a: "Most websites take 1-3 weeks depending on complexity.",
                    },
                    {
                        q: "Do you build mobile apps?",
                        a: "Yes. We develop Android and cross-platform applications.",
                    },
                    {
                        q: "Can you redesign old websites?",
                        a: "Absolutely. We modernize and improve existing websites.",
                    },
                ].map((faq, i) => (
                    <div
                        key={i}
                        style={{
                            background:
                                "#161b22",
                            border:
                                "1px solid #1e2530",
                            borderRadius:
                                "20px",
                            padding:
                                "26px",
                            marginBottom:
                                "18px",
                        }}
                    >
                        <h3
                            style={{
                                marginBottom:
                                    "12px",
                                fontSize:
                                    "21px",
                            }}
                        >
                            {faq.q}
                        </h3>

                        <p
                            style={{
                                color:
                                    "#8b949e",
                                lineHeight:
                                    1.7,
                                margin: 0,
                            }}
                        >
                            {faq.a}
                        </p>
                    </div>
                ))}
            </section>

            {/* CHATBOT */}
            <div
                style={{
                    position: "fixed",
                    bottom: "24px",
                    right: "24px",
                    zIndex: 999,
                }}
            >
                {chatOpen && (
                    <div
                        style={{
                            width:
                                "min(360px, calc(100vw - 32px))",
                            height: "500px",
                            background:
                                "#161b22",
                            border:
                                "1px solid #1e2530",
                            borderRadius:
                                "20px",
                            overflow:
                                "hidden",
                            display: "flex",
                            flexDirection:
                                "column",
                            marginBottom:
                                "14px",
                            boxShadow:
                                "0 20px 50px rgba(0,0,0,0.5)",
                        }}
                    >
                        {/* HEADER */}
                        <div
                            style={{
                                background:
                                    "#e8a020",
                                padding:
                                    "16px 20px",
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center",
                            }}
                        >
                            <div
                                style={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    gap: "12px",
                                }}
                            >
                                <div
                                    style={{
                                        width:
                                            "40px",
                                        height:
                                            "40px",
                                        borderRadius:
                                            "50%",
                                        background:
                                            "rgba(0,0,0,0.15)",
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                    }}
                                >
                                    🤖
                                </div>

                                <div>
                                    <p
                                        style={{
                                            margin: 0,
                                            fontWeight: 700,
                                            color:
                                                "#0d1117",
                                        }}
                                    >
                                        Dantechdevs
                                        AI
                                    </p>

                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize:
                                                "12px",
                                            color:
                                                "rgba(13,17,23,0.7)",
                                        }}
                                    >
                                        Online
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    setChatOpen(
                                        false
                                    )
                                }
                                style={{
                                    background:
                                        "none",
                                    border:
                                        "none",
                                    fontSize:
                                        "22px",
                                    cursor:
                                        "pointer",
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* BODY */}
                        <div
                            style={{
                                flex: 1,
                                overflowY:
                                    "auto",
                                padding:
                                    "16px",
                                display: "flex",
                                flexDirection:
                                    "column",
                                gap: "12px",
                            }}
                        >
                            {messages.map(
                                (msg, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                msg.role ===
                                                    "user"
                                                    ? "flex-end"
                                                    : "flex-start",
                                        }}
                                    >
                                        <div
                                            style={{
                                                background:
                                                    msg.role ===
                                                        "user"
                                                        ? "#e8a020"
                                                        : "#1e2530",
                                                color:
                                                    msg.role ===
                                                        "user"
                                                        ? "#0d1117"
                                                        : "#fff",
                                                padding:
                                                    "12px 14px",
                                                borderRadius:
                                                    "16px",
                                                maxWidth:
                                                    "80%",
                                            }}
                                        >
                                            {
                                                msg.content
                                            }
                                        </div>
                                    </div>
                                )
                            )}

                            {messages.length ===
                                1 && (
                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            flexWrap:
                                                "wrap",
                                            gap: "8px",
                                        }}
                                    >
                                        {suggestions.map(
                                            (
                                                suggestion
                                            ) => (
                                                <button
                                                    key={
                                                        suggestion
                                                    }
                                                    onClick={() =>
                                                        setUserInput(
                                                            suggestion
                                                        )
                                                    }
                                                    style={{
                                                        background:
                                                            "#1e2530",
                                                        border:
                                                            "none",
                                                        color:
                                                            "#fff",
                                                        padding:
                                                            "8px 12px",
                                                        borderRadius:
                                                            "999px",
                                                        cursor:
                                                            "pointer",
                                                    }}
                                                >
                                                    {
                                                        suggestion
                                                    }
                                                </button>
                                            )
                                        )}
                                    </div>
                                )}

                            {loading && (
                                <div
                                    style={{
                                        display:
                                            "flex",
                                        gap: "4px",
                                    }}
                                >
                                    {[0, 1, 2].map(
                                        (i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    width:
                                                        "8px",
                                                    height:
                                                        "8px",
                                                    borderRadius:
                                                        "50%",
                                                    background:
                                                        "#e8a020",
                                                    animation: `bounce 1s ${i * 0.2}s infinite`,
                                                }}
                                            />
                                        )
                                    )}
                                </div>
                            )}

                            <div
                                ref={
                                    chatEndRef
                                }
                            />
                        </div>

                        {/* INPUT */}
                        <div
                            style={{
                                padding:
                                    "14px",
                                borderTop:
                                    "1px solid #1e2530",
                                display: "flex",
                                gap: "10px",
                            }}
                        >
                            <input
                                type="text"
                                value={
                                    userInput
                                }
                                onChange={(e) =>
                                    setUserInput(
                                        e.target
                                            .value
                                    )
                                }
                                onKeyDown={(
                                    e
                                ) =>
                                    e.key ===
                                    "Enter" &&
                                    sendMessage()
                                }
                                placeholder="Ask something..."
                                style={{
                                    flex: 1,
                                    background:
                                        "#0d1117",
                                    border:
                                        "1px solid #1e2530",
                                    borderRadius:
                                        "10px",
                                    padding:
                                        "12px 14px",
                                    color: "#fff",
                                    outline:
                                        "none",
                                }}
                            />

                            <button
                                onClick={
                                    sendMessage
                                }
                                style={{
                                    width:
                                        "44px",
                                    borderRadius:
                                        "10px",
                                    border:
                                        "none",
                                    background:
                                        "#e8a020",
                                    cursor:
                                        "pointer",
                                    fontSize:
                                        "18px",
                                }}
                            >
                                ➤
                            </button>
                        </div>
                    </div>
                )}

                {/* TOGGLE */}
                <button
                    onClick={() =>
                        setChatOpen(
                            !chatOpen
                        )
                    }
                    style={{
                        width: "64px",
                        height: "64px",
                        borderRadius:
                            "50%",
                        border: "none",
                        background:
                            "#e8a020",
                        fontSize: "28px",
                        cursor: "pointer",
                        boxShadow:
                            "0 4px 20px rgba(232,160,32,0.4)",
                    }}
                >
                    {chatOpen
                        ? "×"
                        : "🤖"}
                </button>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .contact-grid {
                        grid-template-columns: 1fr !important;
                    }
                }

                @keyframes bounce {
                    0%, 80%, 100% {
                        transform: translateY(0);
                    }

                    40% {
                        transform: translateY(-8px);
                    }
                }

                @keyframes fadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </main>
    );
}