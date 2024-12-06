# NextJS Flash Message

A lightweight package for managing flash messages in Next.js applications. Flash messages allow you to pass messages between requests by storing them in cookies. This package supports one flash message at a time, making it simple and efficient.

It integrates seamlessly with [Sonner](https://github.com/emilkowalski/sonner) for displaying toast notifications, but you are free to use any library or custom UI implementation.

## Installation

To use the package, first install it via npm or yarn:

```bash
npm install next-js-flash-message
# or
yarn add next-js-flash-message
```

## Features

- Supports multiple levels: info, success, warning, and error.
- Optional support for additional details like descriptions and custom durations.
- Flexible: Works with any UI library for displaying messages.
- Pre-built integration with Sonner for toast notifications.

## Basic usage

### Server Action Example

Here's an example of a server action that sets a flash message and redirects:

```ts
"use server";

import { flashMessage } from "next-js-flash-message";
import { redirect } from "next/navigation";

export const anAction = async (formData: FormData) => {
  // Handle action logic

  // Set a flash message
  await flashMessage("Successfully processed action");

  // Redirect
  redirect("/");
};
```

### Client Component Example

In your client component, retrieve and display the flash message:

```ts
'use client';

import { useEffect } from "react";
import { flashMessage } from "next-js-flash-message";

export default function ClientComponent() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const showFlashMessage = async () => {
      const flash = await flashMessage();

      if (flash) {
        setMessage(flash.message);
      }
    };

    showFlashMessage();
  }, []);

  return <>{message && <div>{message}</div>}</>;
}
```

## Using the Sonner Toast Library

### Setting Up Sonner with `ToasterProvider`

To integrate with `Sonner`, start by adding the `ToasterProvider` to your layout:

Inside your layout add Sonner toast provider like shown below:

```ts
import { ToasterProvider } from "next-js-flash-message/components";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}
```

> NOTE: If you already use the `Sonner` components from `shadcn/ui`, continue using them. This package's components are compatible with those.

### Displaying Flash Messages with `FlashMessageProvider`

Add the `FlashMessageProvider` to your page or component to handle message retrieval and display:

```ts
import { Form } from "@/components/form";
import { FlashMessageProvider } from "next-js-flash-message/components";

export default function Homepage() {
  return (
    <div>
      <main>
        <Form />
        <FlashMessageProvider />
      </main>
    </div>
  );
}
```

> Note: The `FlashMessageProvider` automatically listens for and displays flash messages using `Sonner`.

### Complete Example with Form

Here's a complete example including a form that triggers a server action:

```ts
"use client";

import { anAction } from "@/actions/an-action";

export const Form = () => {
  return (
    <form action={anAction}>
      <input name="name" type="text" placeholder="Enter your name" />
      <button type="submit">Submit</button>
    </form>
  );
};
```

## Using the useFlashMessage Hook

Instead of adding the `FlashMessageProvider` to your page, you can directly use the `useFlashMessage` hook to handle flash message retrieval and display.

### Example: Using useFlashMessage with Sonner

Here's how to use the `useFlashMessage` hook to display flash messages with Sonner:

```ts
"use client";

import { anAction } from "@/actions/an-action";
import { useFlashMessage } from "next-js-flash-message/hooks";

export const Form = () => {
  // Retrieve and display the flash message using Sonner toast
  useFlashMessage();

  return (
    <form action={anAction}>
      <input name="name" type="text" placeholder="Enter your name" />
      <button type="submit">Submit</button>
    </form>
  );
};
```

## Flash message API

The `flashMessage` function supports various configurations:

### Basic Examples

```ts
// Simple message
await flashMessage("My awesome flash message");

// With level
await flashMessage("Action successful", "success");

// With a description
await flashMessage("Error occurred", "error", "Please try again.");
```

### Object-Based Configuration

```ts
await flashMessage({
  message: "Action required",
  level: "info",
  description: "More details about this message.",
});
```

### Additional Options

Customize your flash messages:

```ts
await flashMessage({
  message: "Custom duration and position",
  level: "warning",
  description: "This message lasts for 3 seconds.",
  duration: 3000,
  position: "top-center", // Options: "top-left", "top-center", "top-right", etc.
  closeButton: true,
});
```

### Persistent Toasts

Keep toasts visible until manually dismissed:

```ts
// Using an object you can pass additional options, only the message is mandatory
await flashMessage({
  message: "Persistent message",
  duration: Infinity,
  closeButton: true, // Optionally allow users to dismiss it manually
});
```

## Testing

This package includes comprehensive tests to ensure reliability across all documented use cases.

Run tests using:

```bash
npm test
```

## Credits and Acknowledgments

Thanks to [Robin Wieruch](https://www.robinwieruch.de/) for his insightful tutorials on Next.js.
Kudos to [Emil Kowalski](https://github.com/emilkowalski) for the amazing [Sonner](https://github.com/emilkowalski/sonner) toast library.

Feel free to contribute, report issues, or suggest improvements via the [GitHub repository](https://github.com/thewebartisan7/next-js-flash-message). Happy coding! 🚀
