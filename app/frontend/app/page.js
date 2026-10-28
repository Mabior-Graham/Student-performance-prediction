import Link from "next/link";

export default function LandingPage() {
  return (
    <main>
      {/* Hero */}
      <section
        style={{
          padding: "5rem 1.5rem 4rem",
          maxWidth: 1100,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "0.35rem 0.9rem",
            borderRadius: 999,
            background: "rgba(99,102,241,0.1)",
            color: "#4f46e5",
            fontSize: "0.78rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}
        >
          Early-Warning System
        </div>

        <h1
          style={{
            fontSize: "3.2rem",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            fontWeight: 800,
            marginBottom: "1.25rem",
            maxWidth: 800,
            margin: "0 auto 1.25rem",
          }}
        >
          Identify at-risk students{" "}
          <span style={{ color: "#6366f1" }}>before it&apos;s too late.</span>
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.6,
            opacity: 0.7,
            maxWidth: 650,
            margin: "0 auto 2.5rem",
          }}
        >
          ForeSight uses machine learning to predict student exam performance
          from behavioural data — giving instructors and advisors the insight to
          act early, when intervention still makes a difference.
        </p>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/register"
            style={{
              padding: "0.85rem 1.75rem",
              borderRadius: 10,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.95rem",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(99,102,241,0.25)",
            }}
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            style={{
              padding: "0.85rem 1.75rem",
              borderRadius: 10,
              border: "1px solid rgba(128,128,128,0.3)",
              color: "inherit",
              fontWeight: 600,
              fontSize: "0.95rem",
              textDecoration: "none",
            }}
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section
        style={{
          padding: "4rem 1.5rem",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "2rem",
              letterSpacing: "-0.02em",
              fontWeight: 700,
              marginBottom: "0.5rem",
            }}
          >
            Built for real institutions
          </h2>
          <p style={{ opacity: 0.65, fontSize: "0.95rem" }}>
            Everything an advisor needs — and nothing they don&apos;t.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <FeatureCard
            icon="⚡"
            title="Instant Predictions"
            description="Every student record carries a cached pass-probability score, so lists load in milliseconds — even with thousands of students."
          />
          <FeatureCard
            icon="👥"
            title="Role-Based Access"
            description="Instructors see only their own advisees. Administrators see institution-wide trends. Enforced at the API and the UI."
          />
          <FeatureCard
            icon="🎯"
            title="Actionable Risk Bands"
            description="Colour-coded red / amber / green status makes the at-risk list obvious at a glance. No training required."
          />
          <FeatureCard
            icon="📊"
            title="Explainable Insights"
            description="See which features drive predictions — attendance, study hours, sleep quality — so interventions target the right factor."
          />
          <FeatureCard
            icon="🔒"
            title="Secure by Default"
            description="JWT authentication, bcrypt password hashing, and role-aware data scoping mean sensitive student data stays protected."
          />
          <FeatureCard
            icon="🌍"
            title="Runs Anywhere"
            description="No cloud dependencies. Deploy on a laptop, a local server, or a modest VPS — built for resource-constrained institutions."
          />
        </div>
      </section>

      {/* How it works */}
      <section
        style={{
          padding: "4rem 1.5rem",
          background: "rgba(99,102,241,0.03)",
          borderTop: "1px solid rgba(128,128,128,0.1)",
          borderBottom: "1px solid rgba(128,128,128,0.1)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "2rem",
              letterSpacing: "-0.02em",
              fontWeight: 700,
              marginBottom: "3rem",
            }}
          >
            How it works
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "2rem",
            }}
          >
            <Step
              number="1"
              title="Add students"
              description="Instructors or admins create student records — manually or imported."
            />
            <Step
              number="2"
              title="Predict automatically"
              description="The model computes each student's pass probability at record creation and edit."
            />
            <Step
              number="3"
              title="Act early"
              description="Advisors see a colour-coded at-risk list and intervene before failure."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "5rem 1.5rem",
          textAlign: "center",
          maxWidth: 700,
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            letterSpacing: "-0.02em",
            fontWeight: 700,
            marginBottom: "1rem",
          }}
        >
          Ready to see it in action?
        </h2>
        <p
          style={{
            fontSize: "1rem",
            opacity: 0.65,
            lineHeight: 1.6,
            marginBottom: "2rem",
          }}
        >
          Create a free account and explore the full system — no credit card,
          no setup required.
        </p>
        <Link
          href="/register"
          style={{
            display: "inline-block",
            padding: "0.9rem 2rem",
            borderRadius: 10,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.95rem",
            textDecoration: "none",
            boxShadow: "0 4px 14px rgba(99,102,241,0.25)",
          }}
        >
          Create Account →
        </Link>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "2rem 1.5rem",
          borderTop: "1px solid rgba(128,128,128,0.15)",
          textAlign: "center",
          fontSize: "0.85rem",
          opacity: 0.6,
        }}
      >
        <div style={{ marginBottom: "0.5rem" }}>
          ForeSight · Early-Warning Student Performance Prediction
        </div>
        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
          <Link href="/about" style={{ color: "inherit", textDecoration: "none" }}>
            About
          </Link>
          <Link href="/contact" style={{ color: "inherit", textDecoration: "none" }}>
            Contact
          </Link>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div
      style={{
        padding: "1.75rem 1.5rem",
        borderRadius: 14,
        border: "1px solid rgba(128,128,128,0.18)",
        background: "rgba(255,255,255,0.02)",
        transition: "border-color 0.15s",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 42,
          height: 42,
          borderRadius: 10,
          background: "rgba(99,102,241,0.1)",
          fontSize: "1.2rem",
          marginBottom: "0.85rem",
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: "1rem",
          fontWeight: 700,
          marginBottom: "0.5rem",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "0.88rem",
          opacity: 0.7,
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
    </div>
  );
}

function Step({ number, title, description }) {
  return (
    <div>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "#fff",
          fontSize: "1.1rem",
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 0.85rem",
        }}
      >
        {number}
      </div>
      <h3
        style={{
          fontSize: "1rem",
          fontWeight: 700,
          marginBottom: "0.4rem",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "0.88rem",
          opacity: 0.7,
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
    </div>
  );
}