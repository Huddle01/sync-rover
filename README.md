# SyncRover 🤖

SyncRover is a modern web application that demonstrates real-time, remote control of a vehicle using keyboard commands. This project serves as a proof-of-concept for building interactive, multi-user experiences on the web.

The core real-time functionality is powered by the **Huddle01 SDK**, which enables seamless, low-latency data messaging between the host controller and all viewers.

-----

## Tech Stack

  * **Runtime**: Bun
  * **Framework**: Next.js
  * **Language**: TypeScript
  * **Styling**: Tailwind CSS
  * **UI Components**: shadcn/ui
  * **Animation**: Motion
  * **Real-time Communication**: Huddle01 SDK

-----

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Huddle01/sync-rover.git
cd sync-rover
```

### 2. Set Up Environment Variables

Get your **Project ID** and **API Key** from [huddle01.dev](https://huddle01.dev). Then, create a `.env` file in the project root and add your credentials.

**.env**

```env
NEXT_PUBLIC_PROJECT_ID=YOUR_PROJECT_ID
API_KEY=YOUR_API_KEY
```

### 3. Install and Run

```bash
# Install dependencies
bun install

# Run the development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

-----

## Learn More

To learn more about the real-time capabilities used in this project, check out the [Huddle01 Documentation](https://docs.huddle01.com/docs).