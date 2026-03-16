import { useState } from 'react';
import axios from 'axios';
import { userStore } from '../store/store';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { Coins, Loader2, ArrowRight } from 'lucide-react';

const PACKAGES = [
    { id: 1, gc: 500, price: 1, color: 'bg-blue-500' },
    { id: 2, gc: 1200, price: 2, color: 'bg-purple-500' },
    { id: 3, gc: 5000, price: 5, color: 'bg-amber-500' },
];

function Shop() {
    const [isLoading, setIsLoading] = useState(null);
    const { access_token } = userStore(state => state.user);

    const initiatePayment = async (pkg) => {
        setIsLoading(pkg.id);
        try {
            const response = await axios.post('http://localhost:5000/payments/initiate', {
                amount: pkg.price,
                gcAmount: pkg.gc
            }, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });

            const data = response.data;

            // PayU specifically needs a form POST redirect
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'https://test.payu.in/_payment'; // Test mode URL

            // Append all params from backend
            Object.keys(data).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = data[key];
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();

        } catch (error) {
            console.error(error);
            toast.error('Failed to initiate payment. Please try again.');
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="flex-1 w-full bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 py-12 md:p-6 min-h-[calc(100vh-140px)]">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mb-3">
                    Get More Graffiti Coins
                </h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    Scale your reach! Use GCs to bump your art to the top of the global board.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                {PACKAGES.map((pkg) => (
                    <Card key={pkg.id} className="relative overflow-hidden border-2 transition-all hover:border-slate-400 dark:hover:border-slate-600 bg-white dark:bg-slate-950/50">
                        <div className={`h-2 w-full ${pkg.color}`} />
                        <CardHeader>
                            <div className="flex justify-between items-center mb-2">
                                <Coins className="h-8 w-8 text-amber-500" />
                                <span className="text-2xl font-bold">₹{pkg.price}</span>
                            </div>
                            <CardTitle className="text-3xl font-bold">{pkg.gc} GC</CardTitle>
                            <CardDescription>Instant credit to your profile</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="h-3 w-3" /> Priority Bumping
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="h-3 w-3" /> No Expiry
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={() => initiatePayment(pkg)}
                                className="w-full font-bold py-6 text-lg"
                                disabled={isLoading !== null || !access_token}
                            >
                                {isLoading === pkg.id ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : !access_token ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : 'Buy Now'}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <p className="mt-12 text-xs text-slate-400 text-center max-w-sm">
                Secure payments powered by PayU. Credits are usually instant but may take up to 24 hours in rare cases.
            </p>
        </div>
    );
}

export default Shop;
