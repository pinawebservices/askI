import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
    return (
        <section className="px-6 py-20 lg:px-8 sm:py-32"
                 style={{
                     background: `
      linear-gradient(to right, rgba(240, 249, 255, 0.7), rgba(240, 253, 250, 0.7)),
      radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 50%, rgba(20, 184, 166, 0.05) 0%, transparent 50%)
    `
                 }}>
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-5xl lg:text-6xl leading-tight text-black font-sans font-normal tracking-tight  sm:text-4xl text-balance">
                        Ready to transform your workflow?
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-gray-500 text-pretty">
                        Join thousands of happy customers who have already streamlined their operations. Start your free trial today
                        and see the difference in just minutes.
                    </p>
                    <div className="mt-10 flex items-center justify-center">
                        <Button size="lg" variant="secondary" className="font-medium">
                            Start Free Trial
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        {/*<Button*/}
                        {/*    size="lg"*/}
                        {/*    variant="outline"*/}
                        {/*    className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"*/}
                        {/*>*/}
                        {/*    Schedule Demo*/}
                        {/*</Button>*/}
                    </div>
                </div>
            </div>
        </section>
    )
}
