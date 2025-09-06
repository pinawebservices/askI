import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
    {
        name: "Starter",
        price: "$29",
        description: "Perfect for small teams getting started with automation",
        features: [
            "Up to 1,000 tasks per month",
            "5 active workflows",
            "Basic integrations",
            "Email support",
            "7-day free trial",
        ],
        popular: false,
    },
    {
        name: "Professional",
        price: "$99",
        description: "Ideal for growing teams that need more power and flexibility",
        features: [
            "Up to 10,000 tasks per month",
            "Unlimited workflows",
            "Premium integrations",
            "Priority support",
            "Advanced analytics",
            "Custom fields",
        ],
        popular: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "For large organizations with complex automation needs",
        features: [
            "Unlimited tasks",
            "Unlimited workflows",
            "All integrations",
            "Dedicated support",
            "Advanced security",
            "Custom development",
            "SLA guarantee",
        ],
        popular: false,
    },
]

export function PricingSection() {
    return (
        <section id="pricing" className="px-6 py-20 lg:px-8 sm:py-32">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">Simple, transparent pricing</h2>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
                        Choose the plan that fits your team&apos;s needs. All plans include a 14-day free trial.
                    </p>
                </div>

                <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
                    {plans.map((plan, index) => (
                        <Card key={index} className={`relative ${plan.popular ? "border-primary shadow-lg" : ""}`}>
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 text-sm font-medium rounded-full">
                    Most Popular
                  </span>
                                </div>
                            )}

                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
                                </div>
                                <CardDescription className="mt-4">{plan.description}</CardDescription>
                            </CardHeader>

                            <CardContent>
                                <ul className="space-y-3">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center gap-3">
                                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter>
                                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                                    {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
