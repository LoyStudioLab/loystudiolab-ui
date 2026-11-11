// Deliberately breaks the rules. Used by tests/unit/doctor.test.js only.
import { motion } from "framer-motion"
import { AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Bad() {
  return (
    <div className="rounded-xl shadow-lg bg-gradient-to-r bg-blue-500 text-[#ff0000]">
      <h1>Best-in-class, world-class solutions — for you</h1>
      <h3>Skipped a level</h3>
      <div className="bg-butter p-4" />
      <span className="animate-spin rounded-full" />
      <img src="/x.png" />
      <Button variant="accent">One</Button>
      <Button variant="accent">Two</Button>
    </div>
  )
}
