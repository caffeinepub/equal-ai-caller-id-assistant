import { Shield } from "lucide-react";
import { SiFacebook, SiGithub, SiX } from "react-icons/si";

export default function AppFooter() {
  const year = new Date().getFullYear();
  const utm = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  const productLinks = ["Features", "Pricing", "API", "Changelog"];
  const companyLinks = ["About", "Blog", "Careers", "Press"];
  const resourceLinks = [
    "Documentation",
    "Support",
    "Privacy Policy",
    "Terms of Service",
  ];

  return (
    <footer className="bg-foreground text-card mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">Equal AI</span>
            </div>
            <p className="text-sm text-card/60 max-w-xs leading-relaxed">
              AI-powered caller identification that keeps you safe and informed
              before you pick up.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://github.com"
                className="text-card/50 hover:text-card transition-colors"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiGithub className="w-5 h-5" />
              </a>
              <a
                href="https://x.com"
                className="text-card/50 hover:text-card transition-colors"
                aria-label="X"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiX className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                className="text-card/50 hover:text-card transition-colors"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiFacebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Product</h4>
            <ul className="space-y-2">
              {productLinks.map((item) => (
                <li key={item}>
                  <a
                    href="https://caffeine.ai"
                    className="text-sm text-card/60 hover:text-card transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((item) => (
                <li key={item}>
                  <a
                    href="https://caffeine.ai"
                    className="text-sm text-card/60 hover:text-card transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Resources</h4>
            <ul className="space-y-2">
              {resourceLinks.map((item) => (
                <li key={item}>
                  <a
                    href="https://caffeine.ai"
                    className="text-sm text-card/60 hover:text-card transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-card/10 mt-8 pt-6 text-center text-sm text-card/40">
          © {year}. Built with ❤️ using{" "}
          <a
            href={utm}
            className="underline hover:text-card/70 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
