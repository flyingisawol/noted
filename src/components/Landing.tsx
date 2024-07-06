import { Login } from "./Login"

export const Landing = ({ onClick }: any) => {
    return (
        <div className="landing">
            <Login onClick={onClick} />
        </div>
    )
}