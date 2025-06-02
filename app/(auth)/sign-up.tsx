import SignUpView from "@/views/SignUpView";

export interface AccountDetails {
  /**
   * The name of the user.
   */
  name?: string;

  /**
   * The email address of the user.
   */
  email: string;

  /**
   * The password of the user.
   */
  password: string;
}

const SignUp = () => {
  return <SignUpView />;
};
export default SignUp;
