import { Link } from "@remix-run/react";

// Define the component
export default function Upload() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-full">
      <h1 className="text-2xl text-neutral-content">Upload Successful!</h1>
      <Link className="btn btn-primary" to="/">
        Go to homepage
      </Link>
    </div>
  );
}
