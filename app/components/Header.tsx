import { Form, Link } from "@remix-run/react";

type HeaderProps = {
  user: { email: string } | null;
};

const Header = ({ user }: HeaderProps) => {
  return (
    <header className="border-b-2 border-primary text-white flex p-5 justify-between items-center">
      <Link to="/" className="text-3xl">
        SoundBug
      </Link>
      {user ? (
        <div className="flex items-center gap-4">
          <div className="text-white hidden sm:flex">
            <span>Logged in as {user.email}</span>
          </div>
          <Form
            className="flex justify-center items-center gap-4"
            action="/logout"
            method="post"
          >
            {/* <p className="text-white">Logged in as {user.email}</p> */}
            <button className="btn btn-primary" type="submit">
              Logout?
            </button>
          </Form>
        </div>
      ) : (
        <Link to="/login" className="btn">
          Login
        </Link>
      )}
    </header>
  );
};

export default Header;
