export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      admin_profiles: {
        Row: { id: string; full_name: string; role: Database["public"]["Enums"]["admin_role"]; created_at: string };
        Insert: { id: string; full_name?: string; role?: Database["public"]["Enums"]["admin_role"]; created_at?: string };
        Update: { id?: string; full_name?: string; role?: Database["public"]["Enums"]["admin_role"]; created_at?: string };
        Relationships: [];
      };
      categories: {
        Row: { id: string; name: string; slug: string; code_prefix: string; image_url: string | null; is_active: boolean; created_at: string };
        Insert: { id?: string; name: string; slug: string; code_prefix: string; image_url?: string | null; is_active?: boolean; created_at?: string };
        Update: { id?: string; name?: string; slug?: string; code_prefix?: string; image_url?: string | null; is_active?: boolean; created_at?: string };
        Relationships: [];
      };
      products: {
        Row: {
          id: string; product_code: string; name: string; slug: string; category_id: string; description: string;
          price: number | null; image_url: string | null; gallery: Json; sizes: string[]; colors: string[];
          availability: Database["public"]["Enums"]["availability_status"];
          status: Database["public"]["Enums"]["product_status"];
          is_featured: boolean; created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; product_code?: string; name: string; slug: string; category_id: string; description?: string;
          price?: number | null; image_url?: string | null; gallery?: Json; sizes?: string[]; colors?: string[];
          availability?: Database["public"]["Enums"]["availability_status"];
          status?: Database["public"]["Enums"]["product_status"];
          is_featured?: boolean; created_at?: string; updated_at?: string;
        };
        Update: {
          id?: string; product_code?: string; name?: string; slug?: string; category_id?: string; description?: string;
          price?: number | null; image_url?: string | null; gallery?: Json; sizes?: string[]; colors?: string[];
          availability?: Database["public"]["Enums"]["availability_status"];
          status?: Database["public"]["Enums"]["product_status"];
          is_featured?: boolean; created_at?: string; updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      is_super_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      dashboard_stats: { Args: Record<PropertyKey, never>; Returns: Json };
    };
    Enums: {
      admin_role: "admin" | "super_admin";
      availability_status: "in_stock" | "out_of_stock";
      product_status: "draft" | "published";
    };
    CompositeTypes: { [_ in never]: never };
  };
};
