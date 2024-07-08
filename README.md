# Steps to get started with a new React Native App with Expo CLI

1. Just use command
```
npx create-expo-app@latest -t
```
2. Choose Navigation(typeScript)
3. Give name
4. Then install expo-cli
```
npm i -g expo-cli
```
5. Start the app in phone by using or the Emulator by using the command
```
npm start
```

### If not using Android Studio. Use your phone and install Expo Go App. Scan the QR. All Set.
### For installing Android Studio follow the link below.
[Expo Dev](https://docs.expo.dev/get-started/set-up-your-environment/?mode=expo-go&platform=android&device=simulated)

### We choose Navigation(typescript) that's why we did not need to setup the routes. To setup Navigation routes by ourselves in the app.
> Follow this video
[YouTube Link](https://youtu.be/Z20nUdAUGmM?si=KpH04bbhUpmKu1Xc)

### To deploy. Go to the [Expo dev](https://expo.dev) and make an account.

1. Then type the command to login into your editor
```
expo login
```
3. Enter your userName and PassWord
```
npm install -g eas-cli
eas build -p android
```
4. Press y and y
### This will take 10-30 mins. You can see the project in you expo.dev profile dashboard.
5. And you can see a link in that last. But this is .aab link. We want .apk link to download. To do this follow the below commands.
```
eas build -p android --profile preview
```
### You'll get a QR  and click link to download the App

### When you do any changes, then run
```
npm install -g eas-cli
eas update:configure
eas update --branch main --message "Your update message"
```

### Dependencies version changes
```
npx expo install --check
```
