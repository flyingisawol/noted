
export const Login = ({ handleClick }: any) => {

    return (
        <div className="login-page">
            <img className="login-logo" src="src/assets/noteBubble.png" alt="noted speech bubble" />

            <button
                className="login-button"
                onClick={handleClick}
            >Login with signer</button>
        </div>
    )
}