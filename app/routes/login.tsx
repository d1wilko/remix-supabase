import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import Email from "~/icons/Mail";
import { createSupabaseServerClient } from "~/supabase.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabaseClient, headers } = createSupabaseServerClient(request);

  const formData = await request.formData();

  const { error } = await supabaseClient.auth.signInWithOtp({
    email: formData.get("email") as string,
    options: {
      emailRedirectTo: "http://localhost:5173/auth/callback",
    },
  });

  if (error) {
    return json({ success: false }, { headers });
  }

  return json({ success: true }, { headers });
};

const Login = () => {
  const actionResponse = useActionData<typeof action>();

  if (actionResponse?.success === true) {
    return (
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-7xl text-neutral-content">
          Please check your email.
        </h1>
      </div>
    );
  }

  if (actionResponse?.success === false) {
    return (
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-7xl text-neutral-content">Something went wrong.</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <h3 className="text-4xl text-neutral-content">Log in or Sign up</h3>
      <Form method="post" className="flex flex-col gap-8">
        <div className="input input-bordered flex items-center gap-2">
          <Email />
          <input
            type="email"
            name="email"
            className="grow"
            placeholder="Email"
            required
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Sign In
        </button>
      </Form>
    </div>
  );
};

export default Login;
