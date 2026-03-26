import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ChevronRight,
  History,
  Shield,
  Star,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import type { View } from "../App";
import AppFooter from "../components/AppFooter";
import AppHeader from "../components/AppHeader";

interface LandingPageProps {
  onNavigate: (view: View) => void;
}

const features = [
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: "Spam Detection",
    description:
      "Instantly identify spam calls with AI-powered pattern recognition and community intelligence.",
    bg: "bg-accent",
    iconColor: "text-accent-foreground",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Caller Identification",
    description:
      "Get the full picture on any number \u2014 name, carrier, location, and risk assessment.",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Community Reports",
    description:
      "Crowdsourced reports from millions of users keep the database fresh and accurate.",
    bg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: <History className="w-5 h-5" />,
    title: "Call History",
    description:
      "Keep a full log of every number you've looked up with timestamps and risk scores.",
    bg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
];

const steps = [
  {
    id: "enter",
    number: "01",
    title: "Enter Number",
    description:
      "Type in any phone number you want to identify. We support all US formats and international numbers.",
    preview: (
      <div className="bg-foreground rounded-2xl p-4 w-48 mx-auto text-card">
        <div className="text-xs text-card/50 mb-1">Phone Number</div>
        <div className="text-base font-semibold">(555) 867-5309</div>
        <div className="mt-3 gradient-primary rounded-lg py-2 text-center text-xs font-semibold">
          Lookup Now
        </div>
      </div>
    ),
  },
  {
    id: "analyze",
    number: "02",
    title: "AI Analysis",
    description:
      "Our AI cross-references community reports, carrier data, and behavioral patterns in milliseconds.",
    preview: (
      <div className="bg-foreground rounded-2xl p-4 w-48 mx-auto text-card">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-xs text-card/50">Analyzing\u2026</span>
        </div>
        {[
          { label: "Community DB", pct: 80 },
          { label: "Carrier Data", pct: 60 },
          { label: "AI Model", pct: 95 },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-2 mb-1.5">
            <div className="h-1.5 rounded-full bg-card/10 flex-1 overflow-hidden">
              <div
                className="h-full gradient-primary rounded-full"
                style={{ width: `${s.pct}%` }}
              />
            </div>
            <span className="text-xs text-card/50 w-20">{s.label}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "results",
    number: "03",
    title: "Get Results",
    description:
      "Receive a clear verdict with spam score, category label, and community-verified information.",
    preview: (
      <div className="bg-foreground rounded-2xl p-4 w-48 mx-auto text-card">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <div className="text-xs font-semibold">Spam Likely</div>
            <div className="text-xs text-card/50">Telemarketer</div>
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-card/10 overflow-hidden">
          <div className="h-full bg-red-500 rounded-full w-[82%]" />
        </div>
        <div className="text-xs text-card/50 mt-1">Risk: 82%</div>
      </div>
    ),
  },
];

const testimonials = [
  {
    id: "maria",
    name: "Maria C.",
    text: "Stopped 47 spam calls last month. Equal AI is now on every phone in my family.",
  },
  {
    id: "james",
    name: "James T.",
    text: "The AI accuracy is incredible. It correctly flagged a scam call from a spoofed number instantly.",
  },
  {
    id: "priya",
    name: "Priya S.",
    text: "Love the community reports feature. Knowing others flagged a number gives me real confidence.",
  },
];

const STAR_KEYS = ["st-1", "st-2", "st-3", "st-4", "st-5"];

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader onNavigate={onNavigate} currentView="home" />

      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-20">
          <div className="bg-card rounded-3xl shadow-card overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0 items-stretch">
              {/* Left */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="px-10 py-14 flex flex-col justify-center"
              >
                <div className="inline-flex items-center gap-2 bg-accent rounded-full px-3 py-1 text-xs font-semibold text-accent-foreground mb-5 w-fit">
                  <Shield className="w-3.5 h-3.5" />
                  AI-Powered Caller Protection
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight tracking-tight mb-5">
                  Know Who\u2019s Calling
                  <span className="text-gradient-primary">
                    {" "}
                    Before You Answer
                  </span>
                </h1>
                <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md">
                  Equal AI identifies unknown callers, detects spam and scams,
                  and gives you the power to decide before picking up \u2014 all
                  completely free.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => onNavigate("lookup")}
                    className="gradient-primary text-white font-semibold px-6 py-2.5 rounded-full shadow-cta border-0 hover:opacity-90 transition-opacity"
                    data-ocid="hero.primary_button"
                  >
                    Try Lookup
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                  <Button
                    onClick={() => onNavigate("history")}
                    variant="outline"
                    className="font-semibold px-6 py-2.5 rounded-full border-border hover:bg-muted transition-colors"
                    data-ocid="hero.secondary_button"
                  >
                    View History
                  </Button>
                </div>
                <div className="flex items-center gap-4 mt-8 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-green-500" /> 100% Free
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-primary" /> 2M+ Reports
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-500" /> 4.9 Rating
                  </span>
                </div>
              </motion.div>

              {/* Right: phone mockup */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                className="gradient-hero flex items-center justify-center p-10"
              >
                <img
                  src="/assets/generated/phone-mockup-hero-transparent.dim_480x600.png"
                  alt="Equal AI Caller ID App Screen"
                  className="max-h-72 md:max-h-96 object-contain drop-shadow-2xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-extrabold text-foreground mb-3">
              Key Features
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Everything you need to stay safe and in control of your calls.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${f.bg} ${f.iconColor} flex items-center justify-center mb-4`}
                >
                  {f.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-extrabold text-foreground mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Three simple steps to identify any caller in seconds.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.12 }}
                className="bg-card rounded-2xl p-8 shadow-card text-center"
              >
                <div className="mb-5">{step.preview}</div>
                <div className="inline-block text-xs font-bold text-primary bg-accent rounded-full px-3 py-1 mb-3">
                  Step {step.number}
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-extrabold text-foreground mb-3">
              What Users Say
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Trusted by millions who want to take back control of their phone.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-foreground rounded-2xl p-6 text-card shadow-card"
              >
                <div className="flex gap-0.5 mb-4">
                  {STAR_KEYS.map((sk) => (
                    <Star
                      key={sk}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-card/80 leading-relaxed mb-4">
                  "{t.text}"
                </p>
                <div className="text-sm font-semibold">{t.name}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="gradient-primary rounded-3xl p-12 text-center text-white"
          >
            <h2 className="text-3xl font-extrabold mb-3">
              Ready to Identify Your Callers?
            </h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto">
              Join millions of users who rely on Equal AI to stay safe \u2014
              it\u2019s completely free.
            </p>
            <Button
              onClick={() => onNavigate("lookup")}
              className="bg-white text-primary font-bold px-8 py-3 rounded-full hover:bg-white/90 transition-colors shadow-lg border-0"
              data-ocid="cta.primary_button"
            >
              Start Free Lookup
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
