<h1>Fullstack Discord Website Clone Made Using Next JS, Tailwind CSS, Typescript, MySQL, Prisma, Shadcn-ui, Clerk, Uploading, Socket IO and Much More. </h1>

<h3>!!! --- As WebSocket does not work on Vercel We Hosted It in <a href="https://railway.app/" target="_blank">Railway</a>. But Next/Image Component Does Not Work In Railway So We Use Native <img> Tag. --- !!!</h3>

<h4>Main Project Credit Goes To <a href="https://www.youtube.com/@codewithantonio">Code With Antonio</a>. Great Project Video & Explanation.</h4>

## Cloning the repository
```bash
git clone https://github.com/psykat1116/Discord.git
```

### Important: Change The File Name To Lowercase & Start The File

## Install Package
```bash
cd <your given file name>
npm i
```

## Setup .env File
```bash
DATABASE_URL=

//Upload Images Into Uploadthing
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

// For Initialization Of Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=

// For Live Video Streaming
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=
```

## Setup Prisma ORM
ADD Your MYSQL DataBase URL To env. I use [Planetscale](https://planetscale.com/) as my database.
```bash
npx prisma generate
npx prisma db push
```

## Start the app
```bash
npm run dev
```
