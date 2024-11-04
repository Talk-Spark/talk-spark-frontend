// src/app/dashboard/[userId]/page.tsx
type UserPageProps = {
  params: {
    userId: string;
  };
};

export default function UserPage({ params }: UserPageProps) {
  const { userId } = params;
  return <p>Viewing details for user ID: {userId}</p>;
}
