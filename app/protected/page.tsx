
export default async function ProtectedPage() {

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
          This is a protected page that you can only see as an authenticated
          user
    </div>
  );
}
