import {inngest} from "@/lib/inngest/client";
import {PERSONALIZED_WELCOME_EMAIL_PROMPT} from "@/lib/inngest/prompts";
import {sendWelcomeEmail} from "@/lib/nodemailer";
import {getAllUsersForNewsEmail} from "@/lib/actions/user.action";

export const sendSignUpEmail = inngest.createFunction(
    { id: "sign-up-email" },
    { event: "app/user.created" },
    async ({ event, step }) => {
        const userProfile = `
            - Country: ${event.data.country}
            - Investment goals: ${event.data.investmentGoals}
            - Risk tolerance: ${event.data.riskTolerance}
            - Preferred industry: ${event.data.preferredIndustry}
        `;

        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace("{{userProfile}}", userProfile);

        const response = await step.ai.infer("generate welcome intro", {
            model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite-preview-06-17" }),
            body : {
                contents: [
                    {
                        role: "user",
                        parts: [{ text: prompt }]
                    }
                ]
            }
        });

        await step.run("send-welcome-email", async () => {
            const part = response.candidates?.[0]?.content?.parts?.[0];
            const introText = (part && "text" in part ? part.text : null) || "Terima kasih telah bergabung dengan Signalist. Anda sekarang memiliki alat untuk melacak pasar dan mengambil langkah yang lebih cerdas";

            const { data: {email, name } } = event
            return await sendWelcomeEmail({
                email, name, intro: introText
            });
        });

        return {
            success: true,
            message: "Email selamat datang berhasil dikirim.",
        }
    }
)

export const sendDailyNewsSummary = inngest.createFunction(
    { id: "daily-news-summary" },
    [ { event: "app/send.daily.news" }, { cron: "0 12 * * *" }],
    async ({ step }) => {
        // step #1 : Dapatkan semua pengguna untuk pengiriman berita
        const users = await step.run("get-all-users", getAllUsersForNewsEmail)
        if(!users || users.length === 0) return { success: false, message: "Tidak ada pengguna yang ditemukan untuk email berita." };
    }
)