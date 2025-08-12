export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      adviser_bookings: {
        Row: {
          adviser_id: number | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          message: string | null
          phone: string | null
        }
        Insert: {
          adviser_id?: number | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          message?: string | null
          phone?: string | null
        }
        Update: {
          adviser_id?: number | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          message?: string | null
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adviser_bookings_adviser_id_fkey"
            columns: ["adviser_id"]
            isOneToOne: false
            referencedRelation: "advisers"
            referencedColumns: ["id"]
          },
        ]
      }
      advisers: {
        Row: {
          active: boolean | null
          adviser_vs_lawyer: string | null
          bio: string | null
          created_at: string | null
          display_order: number | null
          expertise: Json | null
          free_consultation: boolean | null
          id: number
          languages: Json | null
          license_number: string | null
          licensingbody_badge_urls: Json | null
          name: string
          previously_worked_badge_urls: Json | null
          profile_photo_url: string | null
          slug: string | null
          video_url: string | null
          worked_at_inz: boolean | null
          years_experience: number | null
        }
        Insert: {
          active?: boolean | null
          adviser_vs_lawyer?: string | null
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          expertise?: Json | null
          free_consultation?: boolean | null
          id?: number
          languages?: Json | null
          license_number?: string | null
          licensingbody_badge_urls?: Json | null
          name: string
          previously_worked_badge_urls?: Json | null
          profile_photo_url?: string | null
          slug?: string | null
          video_url?: string | null
          worked_at_inz?: boolean | null
          years_experience?: number | null
        }
        Update: {
          active?: boolean | null
          adviser_vs_lawyer?: string | null
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          expertise?: Json | null
          free_consultation?: boolean | null
          id?: number
          languages?: Json | null
          license_number?: string | null
          licensingbody_badge_urls?: Json | null
          name?: string
          previously_worked_badge_urls?: Json | null
          profile_photo_url?: string | null
          slug?: string | null
          video_url?: string | null
          worked_at_inz?: boolean | null
          years_experience?: number | null
        }
        Relationships: []
      }
      anzsco_codes: {
        Row: {
          ANZSCO_code: string
          created_time: string | null
          id: number
          occupation_description: string | null
          occupation_name: string
          skill_level: number | null
          skill_level_description: string | null
        }
        Insert: {
          ANZSCO_code: string
          created_time?: string | null
          id?: number
          occupation_description?: string | null
          occupation_name: string
          skill_level?: number | null
          skill_level_description?: string | null
        }
        Update: {
          ANZSCO_code?: string
          created_time?: string | null
          id?: number
          occupation_description?: string | null
          occupation_name?: string
          skill_level?: number | null
          skill_level_description?: string | null
        }
        Relationships: []
      }
      checklist_document_statuses: {
        Row: {
          checklist_id: string
          completed_at: string | null
          created_at: string
          document_type: string
          id: string
          is_completed: boolean
          updated_at: string
        }
        Insert: {
          checklist_id: string
          completed_at?: string | null
          created_at?: string
          document_type: string
          id?: string
          is_completed?: boolean
          updated_at?: string
        }
        Update: {
          checklist_id?: string
          completed_at?: string | null
          created_at?: string
          document_type?: string
          id?: string
          is_completed?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_document_statuses_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "visa_document_checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_documents: {
        Row: {
          checklist_id: string
          document_type: string
          file_name: string
          file_path: string
          file_size: number
          id: string
          mime_type: string
          uploaded_at: string
        }
        Insert: {
          checklist_id: string
          document_type: string
          file_name: string
          file_path: string
          file_size: number
          id?: string
          mime_type: string
          uploaded_at?: string
        }
        Update: {
          checklist_id?: string
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          mime_type?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_documents_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "visa_document_checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_messages: {
        Row: {
          checklist_id: string
          created_at: string
          document_type: string
          id: string
          message: string
          sender_name: string | null
          sender_type: string
        }
        Insert: {
          checklist_id: string
          created_at?: string
          document_type: string
          id?: string
          message: string
          sender_name?: string | null
          sender_type?: string
        }
        Update: {
          checklist_id?: string
          created_at?: string
          document_type?: string
          id?: string
          message?: string
          sender_name?: string | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_messages_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "visa_document_checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      countries_cities: {
        Row: {
          average_salary: number | null
          avg_3_bed_rent_weekly: number | null
          city_name: string | null
          country_id: string | null
          id: number
          mean_house_price: number | null
          population: number | null
          season_name: string | null
          temp_max: number | null
          temp_min: number | null
        }
        Insert: {
          average_salary?: number | null
          avg_3_bed_rent_weekly?: number | null
          city_name?: string | null
          country_id?: string | null
          id: number
          mean_house_price?: number | null
          population?: number | null
          season_name?: string | null
          temp_max?: number | null
          temp_min?: number | null
        }
        Update: {
          average_salary?: number | null
          avg_3_bed_rent_weekly?: number | null
          city_name?: string | null
          country_id?: string | null
          id?: number
          mean_house_price?: number | null
          population?: number | null
          season_name?: string | null
          temp_max?: number | null
          temp_min?: number | null
        }
        Relationships: []
      }
      countries_education: {
        Row: {
          age_group: string | null
          country_id: string | null
          id: number
          level: string | null
          overview: string | null
          provider_type: string | null
          tuition_max: number | null
          tuition_min: number | null
          tuition_type: string | null
        }
        Insert: {
          age_group?: string | null
          country_id?: string | null
          id: number
          level?: string | null
          overview?: string | null
          provider_type?: string | null
          tuition_max?: number | null
          tuition_min?: number | null
          tuition_type?: string | null
        }
        Update: {
          age_group?: string | null
          country_id?: string | null
          id?: number
          level?: string | null
          overview?: string | null
          provider_type?: string | null
          tuition_max?: number | null
          tuition_min?: number | null
          tuition_type?: string | null
        }
        Relationships: []
      }
      countries_headline_info: {
        Row: {
          average_salary: number | null
          cost_of_living_rating: number | null
          cultural_diversity_rating: number | null
          happiness_rating: number | null
          id: string | null
          mean_house_price: number | null
          median_wage: number | null
          minimum_hourly_rate: number | null
          name: string
          official_language: string | null
          quality_of_life_rating: number | null
          safety_rating: number | null
          tipping_culture: string | null
          unemployment_rate: number | null
          workplace_info: Json | null
        }
        Insert: {
          average_salary?: number | null
          cost_of_living_rating?: number | null
          cultural_diversity_rating?: number | null
          happiness_rating?: number | null
          id?: string | null
          mean_house_price?: number | null
          median_wage?: number | null
          minimum_hourly_rate?: number | null
          name: string
          official_language?: string | null
          quality_of_life_rating?: number | null
          safety_rating?: number | null
          tipping_culture?: string | null
          unemployment_rate?: number | null
          workplace_info?: Json | null
        }
        Update: {
          average_salary?: number | null
          cost_of_living_rating?: number | null
          cultural_diversity_rating?: number | null
          happiness_rating?: number | null
          id?: string | null
          mean_house_price?: number | null
          median_wage?: number | null
          minimum_hourly_rate?: number | null
          name?: string
          official_language?: string | null
          quality_of_life_rating?: number | null
          safety_rating?: number | null
          tipping_culture?: string | null
          unemployment_rate?: number | null
          workplace_info?: Json | null
        }
        Relationships: []
      }
      countries_indemand_sectors: {
        Row: {
          average_salary: number | null
          country: string | null
          foreign_qualifications: string | null
          id: number
          licensing_required: string | null
          sector_name: string | null
        }
        Insert: {
          average_salary?: number | null
          country?: string | null
          foreign_qualifications?: string | null
          id: number
          licensing_required?: string | null
          sector_name?: string | null
        }
        Update: {
          average_salary?: number | null
          country?: string | null
          foreign_qualifications?: string | null
          id?: number
          licensing_required?: string | null
          sector_name?: string | null
        }
        Relationships: []
      }
      countries_living_costs: {
        Row: {
          category: string | null
          country_id: string
          id: number
          one_adult: number | null
          two_adults: number | null
          two_adults_one_child: number | null
          two_adults_two_children: number | null
        }
        Insert: {
          category?: string | null
          country_id: string
          id: number
          one_adult?: number | null
          two_adults?: number | null
          two_adults_one_child?: number | null
          two_adults_two_children?: number | null
        }
        Update: {
          category?: string | null
          country_id?: string
          id?: number
          one_adult?: number | null
          two_adults?: number | null
          two_adults_one_child?: number | null
          two_adults_two_children?: number | null
        }
        Relationships: []
      }
      countries_occupations: {
        Row: {
          averageSalary: number | null
          country_id: string | null
          id: number
          jobProspects: number | null
          jobTitle: string
        }
        Insert: {
          averageSalary?: number | null
          country_id?: string | null
          id: number
          jobProspects?: number | null
          jobTitle: string
        }
        Update: {
          averageSalary?: number | null
          country_id?: string | null
          id?: number
          jobProspects?: number | null
          jobTitle?: string
        }
        Relationships: []
      }
      countries_social_system: {
        Row: {
          country_id: string | null
          id: number
          sub_type: string | null
          type: string | null
          value: string | null
        }
        Insert: {
          country_id?: string | null
          id: number
          sub_type?: string | null
          type?: string | null
          value?: string | null
        }
        Update: {
          country_id?: string | null
          id?: number
          sub_type?: string | null
          type?: string | null
          value?: string | null
        }
        Relationships: []
      }
      countries_tax_brackets: {
        Row: {
          country: string | null
          end_range: number | null
          id: number
          rate: number | null
          start_range: number | null
        }
        Insert: {
          country?: string | null
          end_range?: number | null
          id: number
          rate?: number | null
          start_range?: number | null
        }
        Update: {
          country?: string | null
          end_range?: number | null
          id?: number
          rate?: number | null
          start_range?: number | null
        }
        Relationships: []
      }
      greenlist_requirements: {
        Row: {
          anzsco_code: number
          industry: string | null
          occupation_title: string | null
          pathway_tier: string | null
          qualification_requirements: string | null
          registration_body: string | null
          requirements_summary: string | null
          visa_pathway: string | null
        }
        Insert: {
          anzsco_code: number
          industry?: string | null
          occupation_title?: string | null
          pathway_tier?: string | null
          qualification_requirements?: string | null
          registration_body?: string | null
          requirements_summary?: string | null
          visa_pathway?: string | null
        }
        Update: {
          anzsco_code?: number
          industry?: string | null
          occupation_title?: string | null
          pathway_tier?: string | null
          qualification_requirements?: string | null
          registration_body?: string | null
          requirements_summary?: string | null
          visa_pathway?: string | null
        }
        Relationships: []
      }
      job_assessments: {
        Row: {
          created_at: string | null
          email: string
          id: string
          isPaid: boolean | null
          job_description_doc_path: string | null
          job_title: string
          name: string | null
          pay_rate: string | null
          prev_experience: string | null
          qual_docs_path: string | null
          qualifications: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          isPaid?: boolean | null
          job_description_doc_path?: string | null
          job_title: string
          name?: string | null
          pay_rate?: string | null
          prev_experience?: string | null
          qual_docs_path?: string | null
          qualifications?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          isPaid?: boolean | null
          job_description_doc_path?: string | null
          job_title?: string
          name?: string | null
          pay_rate?: string | null
          prev_experience?: string | null
          qual_docs_path?: string | null
          qualifications?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      qualifications: {
        Row: {
          areaOfStudy: string | null
          cost: string | null
          costExplainer: string | null
          courseBenefits: string | null
          courseCredits: number | null
          courseID: number
          courseLength: string | null
          courseLink: string | null
          CourseName: string | null
          courseOutcomes: string | null
          courseOverview: string | null
          LevelOfStudy: string | null
          nzqaLevel: number | null
          providerLink: string | null
          providerLocation: string | null
          providerLogo: string | null
          providerName: string | null
          providerType: string | null
          pswv: string | null
          smcPoints: number | null
          subjectArea: string | null
          workRights: string | null
        }
        Insert: {
          areaOfStudy?: string | null
          cost?: string | null
          costExplainer?: string | null
          courseBenefits?: string | null
          courseCredits?: number | null
          courseID: number
          courseLength?: string | null
          courseLink?: string | null
          CourseName?: string | null
          courseOutcomes?: string | null
          courseOverview?: string | null
          LevelOfStudy?: string | null
          nzqaLevel?: number | null
          providerLink?: string | null
          providerLocation?: string | null
          providerLogo?: string | null
          providerName?: string | null
          providerType?: string | null
          pswv?: string | null
          smcPoints?: number | null
          subjectArea?: string | null
          workRights?: string | null
        }
        Update: {
          areaOfStudy?: string | null
          cost?: string | null
          costExplainer?: string | null
          courseBenefits?: string | null
          courseCredits?: number | null
          courseID?: number
          courseLength?: string | null
          courseLink?: string | null
          CourseName?: string | null
          courseOutcomes?: string | null
          courseOverview?: string | null
          LevelOfStudy?: string | null
          nzqaLevel?: number | null
          providerLink?: string | null
          providerLocation?: string | null
          providerLogo?: string | null
          providerName?: string | null
          providerType?: string | null
          pswv?: string | null
          smcPoints?: number | null
          subjectArea?: string | null
          workRights?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          adviser_id: number | null
          created_at: string | null
          date: string | null
          id: number
          rating: number | null
          review_text: string | null
          reviewer_country: string | null
          reviewer_name: string
        }
        Insert: {
          adviser_id?: number | null
          created_at?: string | null
          date?: string | null
          id?: number
          rating?: number | null
          review_text?: string | null
          reviewer_country?: string | null
          reviewer_name: string
        }
        Update: {
          adviser_id?: number | null
          created_at?: string | null
          date?: string | null
          id?: number
          rating?: number | null
          review_text?: string | null
          reviewer_country?: string | null
          reviewer_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_adviser_id_fkey"
            columns: ["adviser_id"]
            isOneToOne: false
            referencedRelation: "advisers"
            referencedColumns: ["id"]
          },
        ]
      }
      sample_assessment_images: {
        Row: {
          created_at: string
          description: string | null
          file_name: string
          id: string
          image_url: string
          page_number: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_name: string
          id?: string
          image_url: string
          page_number: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_name?: string
          id?: string
          image_url?: string
          page_number?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          item_id: number
          item_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: number
          item_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: number
          item_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visa_application_process: {
        Row: {
          country_id: number | null
          name: string | null
          processing_time_tip: string | null
          step_description: string | null
          step_name: string | null
          step_order: number | null
          table_id: number
          visa_id: number | null
        }
        Insert: {
          country_id?: number | null
          name?: string | null
          processing_time_tip?: string | null
          step_description?: string | null
          step_name?: string | null
          step_order?: number | null
          table_id: number
          visa_id?: number | null
        }
        Update: {
          country_id?: number | null
          name?: string | null
          processing_time_tip?: string | null
          step_description?: string | null
          step_name?: string | null
          step_order?: number | null
          table_id?: number
          visa_id?: number | null
        }
        Relationships: []
      }
      visa_document_checklists: {
        Row: {
          created_at: string
          id: string
          is_completed: boolean
          updated_at: string
          user_id: string
          visa_name: string
          visa_slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_completed?: boolean
          updated_at?: string
          user_id: string
          visa_name: string
          visa_slug: string
        }
        Update: {
          created_at?: string
          id?: string
          is_completed?: boolean
          updated_at?: string
          user_id?: string
          visa_name?: string
          visa_slug?: string
        }
        Relationships: []
      }
      visa_path_edges: {
        Row: {
          created_at: string
          fromVisaUid: string
          id: string
          rationale: string | null
          toVisaUid: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          created_at?: string
          fromVisaUid: string
          id?: string
          rationale?: string | null
          toVisaUid: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          created_at?: string
          fromVisaUid?: string
          id?: string
          rationale?: string | null
          toVisaUid?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "visa_path_edges_fromVisaUid_fkey"
            columns: ["fromVisaUid"]
            isOneToOne: false
            referencedRelation: "visas"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "visa_path_edges_toVisaUid_fkey"
            columns: ["toVisaUid"]
            isOneToOne: false
            referencedRelation: "visas"
            referencedColumns: ["uid"]
          },
        ]
      }
      visa_residence_pathway: {
        Row: {
          country: string | null
          csv_id: number | null
          duration: string | null
          eligibility: string | null
          step_id: number
          step_name: string | null
          step_order: number | null
          timeframe_until_next: string | null
          visa_name: string | null
        }
        Insert: {
          country?: string | null
          csv_id?: number | null
          duration?: string | null
          eligibility?: string | null
          step_id: number
          step_name?: string | null
          step_order?: number | null
          timeframe_until_next?: string | null
          visa_name?: string | null
        }
        Update: {
          country?: string | null
          csv_id?: number | null
          duration?: string | null
          eligibility?: string | null
          step_id?: number
          step_name?: string | null
          step_order?: number | null
          timeframe_until_next?: string | null
          visa_name?: string | null
        }
        Relationships: []
      }
      visas: {
        Row: {
          age_restriction: string | null
          annual_quota: string | null
          application_fee: string | null
          application_url: string | null
          associated_costs: Json | null
          BREAK_visa_conditions_ai: string | null
          can_include_children: string | null
          can_include_partner: string | null
          category: string | null
          children_visa_options: Json | null
          country_id: number | null
          document_tip: string | null
          eligibility_ai_insight: string | null
          eligibility_criteria: Json | null
          english_requirement: string | null
          family_requirements: string | null
          family_tip: string | null
          featured_order: number | null
          funding_requirements: Json | null
          iconName: string | null
          id: number
          insurance_required: string | null
          is_featured: boolean | null
          money_tip: string | null
          must_apply_from: string | null
          name: string | null
          nationality_restriction: string | null
          partner_visa_options: Json | null
          processing_time: string | null
          processing_time_short: string | null
          required_documents: Json | null
          short_description: string | null
          shortDescription: string | null
          slug: string | null
          stage: string | null
          study_rights: string | null
          tags: Json | null
          type: string | null
          uid: string
          validity: string | null
          validity_short: string | null
          visa_conditions: string | null
          what_you_can_do: Json | null
          work_rights: string | null
          your_obligations: Json | null
        }
        Insert: {
          age_restriction?: string | null
          annual_quota?: string | null
          application_fee?: string | null
          application_url?: string | null
          associated_costs?: Json | null
          BREAK_visa_conditions_ai?: string | null
          can_include_children?: string | null
          can_include_partner?: string | null
          category?: string | null
          children_visa_options?: Json | null
          country_id?: number | null
          document_tip?: string | null
          eligibility_ai_insight?: string | null
          eligibility_criteria?: Json | null
          english_requirement?: string | null
          family_requirements?: string | null
          family_tip?: string | null
          featured_order?: number | null
          funding_requirements?: Json | null
          iconName?: string | null
          id: number
          insurance_required?: string | null
          is_featured?: boolean | null
          money_tip?: string | null
          must_apply_from?: string | null
          name?: string | null
          nationality_restriction?: string | null
          partner_visa_options?: Json | null
          processing_time?: string | null
          processing_time_short?: string | null
          required_documents?: Json | null
          short_description?: string | null
          shortDescription?: string | null
          slug?: string | null
          stage?: string | null
          study_rights?: string | null
          tags?: Json | null
          type?: string | null
          uid: string
          validity?: string | null
          validity_short?: string | null
          visa_conditions?: string | null
          what_you_can_do?: Json | null
          work_rights?: string | null
          your_obligations?: Json | null
        }
        Update: {
          age_restriction?: string | null
          annual_quota?: string | null
          application_fee?: string | null
          application_url?: string | null
          associated_costs?: Json | null
          BREAK_visa_conditions_ai?: string | null
          can_include_children?: string | null
          can_include_partner?: string | null
          category?: string | null
          children_visa_options?: Json | null
          country_id?: number | null
          document_tip?: string | null
          eligibility_ai_insight?: string | null
          eligibility_criteria?: Json | null
          english_requirement?: string | null
          family_requirements?: string | null
          family_tip?: string | null
          featured_order?: number | null
          funding_requirements?: Json | null
          iconName?: string | null
          id?: number
          insurance_required?: string | null
          is_featured?: boolean | null
          money_tip?: string | null
          must_apply_from?: string | null
          name?: string | null
          nationality_restriction?: string | null
          partner_visa_options?: Json | null
          processing_time?: string | null
          processing_time_short?: string | null
          required_documents?: Json | null
          short_description?: string | null
          shortDescription?: string | null
          slug?: string | null
          stage?: string | null
          study_rights?: string | null
          tags?: Json | null
          type?: string | null
          uid?: string
          validity?: string | null
          validity_short?: string | null
          visa_conditions?: string | null
          what_you_can_do?: Json | null
          work_rights?: string | null
          your_obligations?: Json | null
        }
        Relationships: []
      }
      website_resources: {
        Row: {
          created_at: string
          id: number
          name: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
