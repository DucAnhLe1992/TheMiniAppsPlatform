import React from "react";
import AppShell from "./components/AppShell";
import { ThemeContextProvider } from "@shared";

const App: React.FC = () => (
	<ThemeContextProvider>
		<AppShell />
	</ThemeContextProvider>
);

export default App;
