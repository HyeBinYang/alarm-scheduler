import express, { Request } from "express";
import schedule from "node-schedule";
import cors from "cors";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

type VisitedDeal = {
  userId: string;
  userEmail: string;
  dealId: string;
  dealTitle: string;
  closedAt: string;
};

type VisitedDealRequestBody = {
  deal: VisitedDeal;
};

interface VisitedDealRequest<T> extends Request {
  body: VisitedDealRequestBody;
}

dotenv.config();

const dealJsonPath = path.join(__dirname, "database/deal.json");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post(
  "/deal/visited-user",
  (req: VisitedDealRequest<VisitedDealRequestBody>, res) => {
    const { deal } = req.body;
    const savedUsersArr: VisitedDeal[] = JSON.parse(
      fs.readFileSync(dealJsonPath, { encoding: "utf8" })
    );

    if (
      !savedUsersArr.some(
        (user) => user.userId === deal.userId && user.dealId === deal.dealId
      )
    ) {
      fs.writeFileSync(dealJsonPath, JSON.stringify([...savedUsersArr, deal]));
    }

    res.send("success");
  }
);

app.listen(8080, () => {
  console.log("Run http server 8080...");
  console.log(process.env.GOOGLE_APP_PASSWORD);

  const rule = new schedule.RecurrenceRule();

  rule.hour = 9;
  rule.minute = 0;
  rule.tz = "Asia/Seoul";

  schedule.scheduleJob(rule, () => {
    console.log(`${new Date()} : Send Email!`);

    const allUsers: VisitedDeal[] = JSON.parse(
      fs.readFileSync(dealJsonPath, { encoding: "utf8" })
    );

    allUsers.forEach((user) => {
      const transporter = nodemailer.createTransport({
        service: "gmail", // 메일 보내는 곳
        auth: {
          user: process.env.NODE_MAILER_AUTH_EMAIL, // 보내는 메일의 주소
          pass: process.env.GOOGLE_APP_PASSWORD, // 보내는 메일의 비밀번호
        },
      });

      const mailOptions = {
        from: process.env.NODE_MAILER_AUTH_EMAIL, // 보내는 메일의 주소
        to: user.userEmail, // 수신할 이메일
        subject: `${user.dealTitle}의 딜 마감일이 하루 남았습니다!`, // 메일 제목
        text: `${user.dealTitle}의 딜 마감일이 하루 남았습니다! 얼른 서두르세요!`, // 메일 내용
      };

      // 메일 발송
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    });
  });
});
