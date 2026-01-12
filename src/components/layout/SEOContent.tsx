import { HelpCircle, Calculator } from 'lucide-react';

export function SEOContent() {
    return (
        <section className="max-w-4xl mx-auto px-4 py-12 space-y-12 text-slate-600">

            {/* Methodology Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Calculator className="w-6 h-6 text-indigo-600" />
                    How We Calculate Your EV Charging Costs
                </h2>
                <div className="space-y-4 leading-relaxed">
                    <p>
                        Our <strong>EV Charging Calculator Malaysia</strong> uses a sophisticated algorithm to estimate your real-world annual charging costs. Unlike simple calculators, we account for:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 marker:text-indigo-500">
                        <li>
                            <strong>Charging Efficiency Losses:</strong> We factor in the ~10-15% energy lost as heat during AC and DC charging, ensuring your cost estimates match your actual electricity bill.
                        </li>
                        <li>
                            <strong>Split Charging Habits:</strong> Most Malaysians charge 80% at home and 20% at public DC chargers. Our tool lets you customize this split to see if a <strong>Gentari Annual Plan</strong> or <strong>JomCharge Membership</strong> is truly worth it for your lifestyle.
                        </li>
                        <li>
                            <strong>TNB Tariff Tiers:</strong> For home charging, we calculate costs based on standard TNB residential rates (Assessment) or specific off-peak tariffs if applicable.
                        </li>
                    </ul>
                </div>
            </div>

            {/* Keyword-Rich FAQ Section */}
            <div className="space-y-8">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-emerald-600" />
                    Frequently Asked Questions
                </h2>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                        <h3 className="font-bold text-slate-900 text-lg">Is the Gentari Annual Plan worth it?</h3>
                        <p className="text-sm leading-relaxed">
                            The <strong>Gentari Annual Membership</strong> (RM 899/year) offers a 50% discount on charging. Our calculator shows that if you travel more than 2,000km/month and use public DC charging for at least 30% of your energy, the plan typically pays for itself within 4 months. Use the slider above to test your specific mileage.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-bold text-slate-900 text-lg">How much does it cost to charge a BYD Atto 3 in Malaysia?</h3>
                        <p className="text-sm leading-relaxed">
                            A standard range BYD Atto 3 (60kWh battery) costs approximately RM 35 for a full charge at home (TNB tariff) versus RM 90 at a standard public DC fast charger (RM 1.50/kWh). This equates to roughly RM 0.08/km for home charging vs RM 0.22/km for public charging.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-bold text-slate-900 text-lg">JomCharge vs Gentari vs ChargeEV: Which is better?</h3>
                        <p className="text-sm leading-relaxed">
                            It depends on your location. <strong>Gentari</strong> has the largest DC fast charging network on highways. <strong>JomCharge</strong> is excellent for urban locations and reliability. <strong>ChargeEV</strong> dominates the AC destination charging market. Our tool compares all three networks simultaneously to find your cheapest option.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-bold text-slate-900 text-lg">What is EV Charging Efficiency Loss?</h3>
                        <p className="text-sm leading-relaxed">
                            When you charge an EV, not all electricity from the grid makes it into the battery. About 10-15% is lost as heat. If your car needs 50kWh, you might actually pull 57kWh from the grid. Our <strong>Malaysia EV Calculator</strong> includes this loss to give you a 100% accurate cost prediction.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer with keywords */}
            <footer className="text-center text-sm text-slate-400 pt-12 border-t border-slate-200">
                <p>
                    &copy; {new Date().getFullYear()} MyEVMath.com. The most accurate <strong>Electric Vehicle Cost Calculator for Malaysia</strong>.
                    <br />
                    Independently built for the Malaysian EV Community. Not affiliated with Gentari, JomCharge, or TNB.
                </p>
            </footer>
        </section>
    );
}
