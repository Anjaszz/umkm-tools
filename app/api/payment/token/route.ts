
import { NextResponse } from "next/server";
// @ts-ignore
import midtransClient from "midtrans-client";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
    try {
        const { userId, email, fullName } = await req.json();

        const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
        // Auto-detect environment: if key starts with 'SB', it's sandbox. Otherwise production.
        const isProduction = !serverKey.startsWith("SB");

        // Initialize Snap API
        let snap = new midtransClient.Snap({
            isProduction: isProduction,
            serverKey: serverKey,
            clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""
        });

        const orderId = `PREM-${nanoid(8)}`;

        let parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: 50000 
            },
            customer_details: {
                first_name: fullName,
                email: email,
                phone: ""
            },
            item_details: [
                 {
                    id: "premium-upgrade",
                    price: 50000,
                    quantity: 1,
                    name: "Premium Lifetime Upgrade"
                 }
            ],
            // Custom field to pass user ID to the webhook notification
            custom_field1: userId
        };

        const transaction = await snap.createTransaction(parameter);
        
        return NextResponse.json({ 
            token: transaction.token,
            redirect_url: transaction.redirect_url
        });

    } catch (error: any) {
        console.error("Midtrans Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create transaction" },
            { status: 500 }
        );
    }
}
