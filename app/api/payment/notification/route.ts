
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
// @ts-ignore
import midtransClient from "midtrans-client";

export async function POST(req: Request) {
    try {
        const notificationJson = await req.json();
        
        const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
        const isProduction = !serverKey.startsWith("SB");
        
        // Initialize Snap API to verify notification
        let apiClient = new midtransClient.Snap({
            isProduction: isProduction,
            serverKey: serverKey,
            clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""
        });

        const statusResponse = await apiClient.transaction.notification(notificationJson);
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;
        const userId = statusResponse.custom_field1;

        console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

        if (transactionStatus == 'capture'){
            if (fraudStatus == 'challenge'){
                // DO Nothing
            } else if (fraudStatus == 'accept'){
                 await upgradeUser(userId);
            }
        } else if (transactionStatus == 'settlement'){
            await upgradeUser(userId);
        } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire'){
            // Payment failed
        } else if (transactionStatus == 'pending'){
            // Payment pending
        }

        return NextResponse.json({ status: "OK" });

    } catch (error: any) {
        console.error("Notification Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function upgradeUser(userId: string) {
    if (!userId) return;
    
    // Initialize Supabase Admin Client
    // We need SERVICE_ROLE_KEY to bypass RLS and update other users
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Must be in .env.local

    if (!supabaseServiceKey) {
        console.error("SUPABASE_SERVICE_ROLE_KEY is missing!");
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Call the RPC function we created earlier
    const { error } = await supabase.rpc('set_user_role', {
        p_user_id: userId,
        p_role: 'premium'
    });

    if (error) {
        console.error("Failed to upgrade user:", error);
    } else {
        console.log(`User ${userId} upgraded to Premium successfully.`);
    }
}
