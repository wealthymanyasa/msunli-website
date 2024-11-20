import { Button } from "@/components/ui/button";
import { auth, signOut } from "auth"

const SettingsPage = async () => {

  const session = await auth();
  return (
    <div className="flex items-center justify-center h-screen px-8">
      {JSON.stringify(session)}
      <form action={ async () =>{
        "use server"

        await signOut();
      }}>

        <Button type="submit">
          Sign Out
        </Button>
      </form>
      </div>
  )
}

export default SettingsPage