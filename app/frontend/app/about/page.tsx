import Link from "next/link";

export default function AboutPage() {
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
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}
        >
          For Institutions
        </div>

        <h1
          style={{
            fontSize: "2.8rem",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            fontWeight: 800,
            marginBottom: "1.25rem",
            maxWidth: 820,
            margin: "0 auto 1.25rem",
          }}
        >
          Every student who drops out{" "}
          <span style={{ color: "#6366f1" }}>was someone you could have saved.</span>
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.65,
            opacity: 0.7,
            maxWidth: 680,
            margin: "0 auto 2.5rem",
          }}
        >
          ForeSight gives your instructors and advisors the early-warning
          signals they need to reach at-risk students before failure becomes
          final — without hiring more staff or buying expensive analytics
          platforms.
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
            Request a Demo
          </Link>
          <Link
            href="/contact"
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
            Talk to Us
          </Link>
        </div>
      </section>

      {/* The cost of doing nothing */}
      <section
        style={{
          padding: "4rem 1.5rem",
          background: "rgba(220,38,38,0.03)",
          borderTop: "1px solid rgba(220,38,38,0.1)",
          borderBottom: "1px solid rgba(220,38,38,0.1)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "1.9rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            The cost of late intervention
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.5rem",
            }}
          >
            <StatCard
              stat="1 in 3"
              label="First-year students drop out or change institutions"
              source="Global higher-education retention data"
            />
            <StatCard
              stat="80%"
              label="Higher persistence rate for students who receive proactive advising"
              source="Randomised controlled trial, large US university"
            />
            <StatCard
              stat="0.3 GPA"
              label="Average GPA improvement from early-warning-based intervention"
              source="Same trial, 2023"
            />
          </div>

          <p
            style={{
              fontSize: "0.95rem",
              lineHeight: 1.7,
              opacity: 0.7,
              textAlign: "center",
              maxWidth: 700,
              margin: "2.5rem auto 0",
            }}
          >
            Every student who leaves costs your institution tuition revenue,
            damages your completion rates, and — most importantly — represents
            a life trajectory that could have been different. The earlier you
            know, the more you can do.
          </p>
        </div>
      </section>

      {/* What ForeSight gives you */}
      <section style={{ padding: "4rem 1.5rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "1.9rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: "0.5rem",
            }}
          >
            What ForeSight gives your institution
          </h2>
          <p style={{ opacity: 0.65, fontSize: "0.95rem" }}>
            Six capabilities that turn prediction into action.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <ValueCard
            icon="🎯"
            title="Identify at-risk students weeks earlier"
            description="Predict exam performance from attendance, study habits, sleep quality, and other behavioural signals — before the first exam reveals the problem."
          />
          <ValueCard
            icon="⚡"
            title="See your full cohort in milliseconds"
            description="No waiting for batch reports. Every student's risk status loads instantly, even for cohorts of 1,200 or more."
          />
          <ValueCard
            icon="👥"
            title="Give each advisor only their own students"
            description="Instructors see their advisees. Administrators see institution-wide trends. Built-in role separation ensures privacy and focus."
          />
          <ValueCard
            icon="🚦"
            title="Focus on who needs help most"
            description="Red / amber / green risk bands make the priority list obvious at a glance. No training required — advisors know where to start."
          />
          <ValueCard
            icon="📊"
            title="Understand what's driving the risk"
            description="Each prediction is paired with the factors that drove it — attendance, sleep, study hours — so interventions target the right cause."
          />
          <ValueCard
            icon="🔒"
            title="Meet institutional data-protection standards"
            description="Encrypted passwords, short-lived tokens, and role-scoped access mean sensitive student records stay protected."
          />
        </div>
      </section>

      {/* Built for your context */}
      <section
        style={{
          padding: "4rem 1.5rem",
          background: "rgba(99,102,241,0.03)",
          borderTop: "1px solid rgba(128,128,128,0.1)",
          borderBottom: "1px solid rgba(128,128,128,0.1)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "1.9rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            Built for institutions that don't have a data team
          </h2>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.75,
              opacity: 0.75,
              textAlign: "center",
              maxWidth: 700,
              margin: "0 auto 2.5rem",
            }}
          >
            Most analytics platforms assume you have a dedicated IT department,
            a cloud budget, and a data integration team. ForeSight assumes you
            don't. It runs on a single laptop, a modest local server, or a
            small cloud instance. There is no LMS integration to configure, no
            API keys to obtain, and no ongoing vendor relationship.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.25rem",
            }}
          >
            <ContextCard
              title="No cloud dependency"
              description="Everything runs on-premises or on a small VPS. Your data never leaves your institution."
            />
            <ContextCard
              title="No LMS integration required"
              description="Works with manual data entry or bulk CSV upload — no Canvas, Moodle, or Blackboard connection needed."
            />
            <ContextCard
              title="Runs on modest hardware"
              description="A laptop or an entry-level server. No specialised infrastructure, no dedicated IT staff."
            />
            <ContextCard
              title="Deploys in a single afternoon"
              description="Install, seed the first cohort, and you're ready for the first semester — no long integration cycles."
            />
          </div>
        </div>
      </section>

      {/* How it works for your institution */}
      <section style={{ padding: "4rem 1.5rem", maxWidth: 900, margin: "0 auto" }}>
        <h2
          style={{
            fontSize: "1.9rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "2.5rem",
            textAlign: "center",
          }}
        >
          From onboarding to intervention in four steps
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <Step
            number="1"
            title="Import your cohort"
            description="Your academic office creates student records with the eleven required features — attendance, study hours, sleep quality, demographic background. Bulk CSV upload available for large cohorts."
          />
          <Step
            number="2"
            title="Predictions are computed automatically"
            description="Each student's pass probability is computed at record creation and stored. No batch jobs, no waiting. By the time your advisors log in, the data is already there."
          />
          <Step
            number="3"
            title="Advisors see their priority list"
            description="Each advisor logs into their dashboard and sees only their own cohort, sorted by risk. Red students appear first — those are the ones to contact this week."
          />
          <Step
            number="4"
            title="Intervention begins, and outcomes are tracked"
            description="Advisors use the profile and explanation data to decide the right intervention — a phone call, a tutoring referral, an attendance conversation. The system records the action and updates risk levels as the student's data changes."
          />
        </div>
      </section>

      {/* Proof / validation */}
      <section
        style={{
          padding: "4rem 1.5rem",
          background: "rgba(5,150,105,0.03)",
          borderTop: "1px solid rgba(5,150,105,0.1)",
          borderBottom: "1px solid rgba(5,150,105,0.1)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "1.9rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: "1rem",
            }}
          >
            Validated on real-world data
          </h2>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.75,
              opacity: 0.75,
              maxWidth: 700,
              margin: "0 auto 2.5rem",
            }}
          >
            ForeSight's predictive model was trained on 16,000 student records
            and achieves a coefficient of determination (R²) of 0.73 on
            held-out test data — meaning it explains 73% of the variance in
            exam scores. It outperformed both Random Forest and Gradient
            Boosting models on the same dataset.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
              maxWidth: 700,
              margin: "0 auto",
            }}
          >
            <ProofPoint stat="0.73" label="R² (predictive accuracy)" />
            <ProofPoint stat="16,000" label="Training records" />
            <ProofPoint stat="280 ms" label="Dashboard load (1,200 students)" />
            <ProofPoint stat="0" label="Cloud dependencies" />
          </div>

          <p
            style={{
              fontSize: "0.85rem",
              opacity: 0.6,
              marginTop: "2rem",
              lineHeight: 1.6,
            }}
          >
            Predictions are a decision aid, not a final grade. ForeSight is
            designed to guide instructor judgement — never to replace it.
          </p>
        </div>
      </section>

      {/* Who it's for */}
      <section style={{ padding: "4rem 1.5rem", maxWidth: 900, margin: "0 auto" }}>
        <h2
          style={{
            fontSize: "1.9rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "2.5rem",
            textAlign: "center",
          }}
        >
          Who ForeSight is for
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <AudienceCard
            icon="🎓"
            title="Universities and colleges"
            description="Institutions with 500–5,000 students where advisor-to-student ratios are high and early-warning processes are manual or missing."
          />
          <AudienceCard
            icon="📚"
            title="Secondary schools"
            description="Schools with large student bodies where teachers need early-warning signals but have no data team to build them."
          />
          <AudienceCard
            icon="🌍"
            title="Institutions in emerging markets"
            description="Schools and universities in contexts where cloud platforms, LMS integration, and dedicated IT staff are not available."
          />
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "5rem 1.5rem",
          textAlign: "center",
          maxWidth: 800,
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "2.2rem",
            letterSpacing: "-0.02em",
            fontWeight: 800,
            marginBottom: "1rem",
          }}
        >
          Every prediction is a chance to intervene.
        </h2>
        <p
          style={{
            fontSize: "1rem",
            opacity: 0.7,
            lineHeight: 1.7,
            marginBottom: "2rem",
            maxWidth: 600,
            margin: "0 auto 2rem",
          }}
        >
          Explore the system with a demo account, or reach out to discuss
          deployment for your institution.
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
            Request a Demo →
          </Link>
          <Link
            href="/contact"
            style={{
              padding: "0.9rem 2rem",
              borderRadius: 10,
              border: "1px solid rgba(128,128,128,0.3)",
              color: "inherit",
              fontWeight: 600,
              fontSize: "0.95rem",
              textDecoration: "none",
            }}
          >
            Contact Sales
          </Link>
        </div>
      </section>
    </main>
  );
}

/* ---------- Components ---------- */

function StatCard({
  stat,
  label,
  source,
}: {
  stat: string;
  label: string;
  source: string;
}) {
  return (
    <div
      style={{
        padding: "1.5rem 1.4rem",
        borderRadius: 12,
        border: "1px solid rgba(220,38,38,0.15)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div
        style={{
          fontSize: "2.2rem",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: "#b91c1c",
          marginBottom: "0.6rem",
          lineHeight: 1.1,
        }}
      >
        {stat}
      </div>
      <div
        style={{
          fontSize: "0.9rem",
          fontWeight: 600,
          lineHeight: 1.5,
          marginBottom: "0.5rem",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: "0.75rem", opacity: 0.55, lineHeight: 1.5 }}>
        {source}
      </div>
    </div>
  );
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        padding: "1.5rem 1.5rem",
        borderRadius: 14,
        border: "1px solid rgba(128,128,128,0.18)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 44,
          height: 44,
          borderRadius: 10,
          background: "rgba(99,102,241,0.1)",
          fontSize: "1.25rem",
          marginBottom: "1rem",
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: "1rem",
          fontWeight: 700,
          marginBottom: "0.5rem",
          lineHeight: 1.4,
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: "0.88rem", opacity: 0.75, lineHeight: 1.6 }}>
        {description}
      </p>
    </div>
  );
}

function ContextCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        padding: "1.25rem 1.4rem",
        borderRadius: 12,
        border: "1px solid rgba(128,128,128,0.15)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <h3
        style={{
          fontSize: "0.95rem",
          fontWeight: 700,
          marginBottom: "0.4rem",
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: "0.85rem", opacity: 0.75, lineHeight: 1.6 }}>
        {description}
      </p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "1.25rem",
        alignItems: "flex-start",
        padding: "1.5rem 1.4rem",
        borderRadius: 12,
        border: "1px solid rgba(128,128,128,0.18)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "#fff",
          fontWeight: 800,
          fontSize: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {number}
      </div>
      <div>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            marginBottom: "0.35rem",
          }}
        >
          {title}
        </h3>
        <p style={{ fontSize: "0.9rem", opacity: 0.75, lineHeight: 1.65 }}>
          {description}
        </p>
      </div>
    </div>
  );
}

function ProofPoint({ stat, label }: { stat: string; label: string }) {
  return (
    <div
      style={{
        padding: "1.25rem 1rem",
        borderRadius: 10,
        border: "1px solid rgba(5,150,105,0.15)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div
        style={{
          fontSize: "1.6rem",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: "#059669",
          lineHeight: 1.1,
          marginBottom: "0.3rem",
        }}
      >
        {stat}
      </div>
      <div style={{ fontSize: "0.78rem", opacity: 0.7, lineHeight: 1.5 }}>
        {label}
      </div>
    </div>
  );
}

function AudienceCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        padding: "1.75rem 1.5rem",
        borderRadius: 14,
        border: "1px solid rgba(128,128,128,0.18)",
        background: "rgba(255,255,255,0.02)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 48,
          height: 48,
          borderRadius: 12,
          background: "rgba(99,102,241,0.1)",
          fontSize: "1.4rem",
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
      <p style={{ fontSize: "0.87rem", opacity: 0.75, lineHeight: 1.6 }}>
        {description}
      </p>
    </div>
  );
}