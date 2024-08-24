// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
	base: "/", // Base path for all assets. Adjust if your site isn't deployed at the root.
	build: {
		outDir: "dist", // Output directory for the build files.
	},
	// other configurations...
});
