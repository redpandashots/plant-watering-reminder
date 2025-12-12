# 🌱 Plant Watering Reminder

A beautiful, interactive web application to help you never forget to water your plants! Built with React and designed with care for plant lovers in Lithuania.

## Features

- 📅 **Interactive Calendar**: Visual calendar showing when each plant needs watering
- 🌿 **Plant Cards**: Beautiful cards for each plant with status indicators and care tips
- 💧 **Watering Tracking**: Mark plants as watered and track your watering history
- 🔔 **Browser Notifications**: Get reminders when it's time to water your plants
- 🌍 **Seasonal Adjustments**: Automatically adjusts watering schedules based on Lithuania's seasons
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## Plants Included

1. **🌶️ Cayenne Pepper** - Water every 1-2 weeks
2. **🌱 Cayenne Pepper Offsprings** - Water every 1-2 weeks
3. **🌸 Cyclamen** - Water every 1-2 weeks (reduced in summer dormancy)
4. **🌺 Kalanchoe** - Water every 1-2 weeks (reduced in winter)
5. **🌵 Cactus** - Water every 2-4 weeks

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Start Tracking**: Click "Watered Today" on any plant card to start tracking
2. **View Calendar**: Switch to calendar view to see upcoming watering dates
3. **Enable Notifications**: Click the bell icon in the header to enable browser notifications
4. **View Care Tips**: Click "💡 Care Tips" on any plant card for detailed care instructions

## Seasonal Adjustments

The app automatically adjusts watering frequencies based on Lithuania's seasons:

- **Winter (Dec-Feb)**: Kalanchoe watering reduced
- **Spring (Mar-May)**: Normal watering schedules
- **Summer (Jun-Aug)**: Cyclamen enters dormancy (reduced watering)
- **Fall (Sep-Nov)**: Normal watering schedules

## Technologies Used

- React 18
- Vite
- date-fns
- LocalStorage API
- Browser Notification API

## License

MIT

## Contributing

Feel free to submit issues or pull requests!

