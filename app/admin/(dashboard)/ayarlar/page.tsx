import { AdminPageHeader } from "@/components/admin/ui"
import { SettingsManager } from "@/components/admin/settings-manager"
import { UsersManager } from "@/components/admin/users-manager"

export default function AdminAyarlarPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="Site Ayarları"
        description="Sitenin tüm ayarlarını ve kullanıcıları buradan yönetin."
      />
      <div className="mt-2">
        <UsersManager />
      </div>
      <SettingsManager />
    </div>
  )
}
