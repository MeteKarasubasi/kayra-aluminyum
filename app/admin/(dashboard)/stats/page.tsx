import { AdminPageHeader, AdminCard } from "@/components/admin/ui"

export default function AdminStatsPage() {
  return (
    <div>
      <AdminPageHeader title="İstatistikler" description="Site trafiği ve etkileşim." />
      <AdminCard>
        <p className="text-sm text-muted-foreground">
          İstatistiklerinizi buradan takip edebilirsiniz.
        </p>
      </AdminCard>
    </div>
  )
}