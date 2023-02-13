require("dotenv").config();
const Mailjet = require("node-mailjet");

const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY,
    process.env.MJ_API_SECRET
);

exports.sendmail = async (email) => {
    const request = await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
            {
                From: {
                    Email: "essienemma300dev@gmail.com",
                    Name: "Essiens Online Store",
                },
                To: [
                    {
                        Email: email,
                        Name: "Customer",
                    },
                ],
                Subject: "Your login in is successful!",
                TextPart: "Dear Customer, welcome to Essiens store!",
                HTMLPart:
                    "<h3>Dear Customer, welcome to Essiens store</h3><br />May the delivery force be with you!",
            },
        ],
    });
    console.log(
        request.response.status === 200 ? "mail sent" : "mail Not sent"
    );
};
