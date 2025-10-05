# Weather Cards App

A React Native weather tracking application built with Expo that allows users to manage weather locations and view real-time weather data with sorting capabilities.

## Features

- **User Authentication**: Sign up and login with email/password
- **Weather Location Management**: Add, view, and remove weather locations with coordinates
- **Real-time Weather Data**: Fetches current weather conditions using Open-Meteo API
- **Weather Dashboard**: Displays weather cards with temperature, humidity, wind speed, UV index, and precipitation
- **Advanced Sorting**: Sort weather locations by various criteria (name, temperature, humidity, etc.) with ascending/descending options
- **User-specific Data**: Weather locations are bound to authenticated users

## Installation & Setup

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (Xcode) or Expo Go app on your device

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/DPangerl/rn-task-weather-cards.git
   cd rn-task-weather-cards
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npx expo start
   ```

4. **Run on iOS Simulator**
   - Press `i` in the terminal to open iOS Simulator
   - Or scan the QR code with Expo Go app on your physical iOS device

### Usage

1. Create an account or login with existing credentials
2. Navigate to "Weather Locations" tab to add weather locations
3. Search for cities and add them to your list
4. View weather cards on the "Dashboard" tab
5. Use the sort button to organize weather data by different criteria

---

# Senior React Native Engineer - Take-Home Challenge

Build a **Health Environment Tracker** mobile application that helps users understand how environmental conditions might impact their health activities. The app integrates weather data and provides personalized activity recommendations.

- **Estimated Time:** 2 hours
- **Tech Stack:** React Native (Expo), TypeScript

## Description

Create a React Native application that:

- Authenticates users with a simple login flow
- Fetches and displays weather data from an external API
- Allows users to sort and filter

## Technical Requirements

### 1. Authentication

- register flow
- login screen with email/password
- Store auth state and implement a way to store registered users

### 2. External API Integration

- Fetch weather for at least 3 cities using a public free API of your choice

### 3. Main Dashboard

- Display weather in cards per city
- Add the ability to sort locations based on different parameters

## How to submit

- Please fork this repository as your starting point
- As a submission, provide us with a link to your finished repo
- Please include instructions for how to install and run the project in the readme

## Evaluation Criteria

- State Management
- Persistence
- Authentification & Security
- API Integration & Error Handling
- Architecture & Code Quality
- Advanced Features
- Development Experience
