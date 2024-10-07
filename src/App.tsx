import SignIn from "@components/auth/SignIn"
import SignUp from "@components/auth/SignUp"
import NavBar from "@components/NavBar"
import { cn } from "lib/cn"
import { useAppDispatch, useAppSelector } from "lib/store"
import { PiMoonStarsFill, PiSunDimFill } from "react-icons/pi"
import { Route, Routes, useLocation } from "react-router-dom"
import { setTheme } from "slice/themeSlice"

const App = () => {
  const theme = useAppSelector(state => state.theme)
  const { pathname } = useLocation()
  const dispatch = useAppDispatch()
  return (
    <div className={cn("dark:bg-[#212121] dark:text-white bg-white relative h-screen",
      theme.value
    )}>
      <button onClick={() => dispatch(setTheme(theme.value === "light" ? "dark" : "light"))} className={cn("absolute top-5 right-10 dark:border-[#494949] rounded-lg p-3 dark:hover:bg-[#171717] lg:dark:bg-transparent dark:bg-[#171717] hover:bg-gray-300 duration-300 border z-10",
        pathname === "/" && "hidden"
      )}>
        {theme.value === "light" ? <PiMoonStarsFill /> :
          <PiSunDimFill />}
      </button>
      <NavBar />
      <Routes>
        <Route element={<SignIn />} path="/sign-in" />
        <Route element={<SignUp />} path="/sign-up" />
        <Route element={<h1>hi</h1>} path="/" />
      </Routes>
    </div>
  )
}

export default App