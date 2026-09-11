import QuizApp from "@/components/QuizApp";

export default function Home() {
  return (
    <main className="sky-scene">
      <span className="lantern left-[28%] bg-[#ff6b4a]" />
      <span className="lantern left-[22%] bg-[#ffcf4a] [animation-delay:0.4s]" />
      <span className="lantern right-[18%] bg-[#ff7a3c] [animation-delay:0.8s]" />
      <span className="lantern right-[8%] bg-[#f25f5c] [animation-delay:1.1s]" />
      <span className="star left-[12%] top-[22%]" />
      <span className="star left-[40%] top-[12%] [animation-delay:0.6s]" />
      <span className="star right-[28%] top-[20%] [animation-delay:1.2s]" />
      <span className="star right-[12%] top-[38%] [animation-delay:0.3s]" />
      <QuizApp />
    </main>
  );
}
