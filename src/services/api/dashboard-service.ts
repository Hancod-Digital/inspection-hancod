import { Supabase } from "./utils";

export type DashboardEquipment = {
  id: number;
  equipment_no?: string | null;
  equipment?: string | null;
  item_type?: string | null;
  property_table_type?: string | null;
  last_thorough_date?: string | null;
  last_test_date?: string | null;
  next_thorough_date?: string | null;
  next_test_date?: string | null;
  title?: string | null;
  status?: string | null;
};

export type DashboardInspection = {
  id: number;
  inspection_date?: string | null;
  next_thorough_exam?: string | null;
  next_test_exam?: string | null;
  equipment?: string | null;
  title?: string | null;
  certificate_no?: string | null;
  test_cert_coc_no?: string | null;
  result?: string | null;
  approval_status?: string | boolean | null;
  safe_to_use?: boolean | null;
  type_of_exam?: string | null;
};

export type DashboardSnapshot = {
  equipment: DashboardEquipment[];
  inspections: DashboardInspection[];
};

export class DashboardService extends Supabase {
  async getSnapshot(): Promise<DashboardSnapshot> {
    const [equipment, liftingEquipment, singleGear] = await Promise.all([
      this.supabase.from("v_equipment").select("*").order("created_at", { ascending: false }),
      this.supabase.from("lifting_equipment_view").select("*").order("created_at", { ascending: false }),
      this.supabase.from("lifting_gear_single_view").select("*").order("created_at", { ascending: false }),
    ]);

    const firstError = equipment.error ?? liftingEquipment.error ?? singleGear.error;
    if (firstError) throw new Error(firstError.message);

    return {
      equipment: (equipment.data ?? []) as DashboardEquipment[],
      inspections: [
        ...((liftingEquipment.data ?? []) as DashboardInspection[]),
        ...((singleGear.data ?? []) as DashboardInspection[]),
      ],
    };
  }
}
