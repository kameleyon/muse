-- migrations/20250327001000_create_pitch_deck_tables.sql
-- Migration script for enhanced Pitch Deck Generation flow

BEGIN;

-- Ensure the uuid-ossp extension is available for gen_random_uuid()
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- Uncomment if using uuid_generate_v4()
-- Using gen_random_uuid() which is part of pgcrypto, usually enabled by default.

-- Trigger function to update last_modified timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_modified = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 1. Create Organizations table
CREATE TABLE IF NOT EXISTS public.organizations (
    organization_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_name TEXT NOT NULL,
    industry TEXT,
    logo_url TEXT,
    brand_colors JSONB,
    fonts JSONB,
    admin_profile_id UUID, -- FK to profiles table
    creation_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE public.organizations IS 'Stores information about organizations using MagicMuse.';
COMMENT ON COLUMN public.organizations.brand_colors IS 'Stores brand color palette as JSON.';
COMMENT ON COLUMN public.organizations.fonts IS 'Stores brand font information as JSON.';

-- Apply trigger to organizations
CREATE TRIGGER update_organizations_modtime
BEFORE UPDATE ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- 2. Create Templates table
CREATE TABLE IF NOT EXISTS public.templates (
    template_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_name TEXT NOT NULL,
    template_category TEXT,
    template_description TEXT,
    template_preview_url TEXT,
    industry_relevance JSONB, -- Storing as JSONB for flexibility
    popularity_score INTEGER DEFAULT 0,
    creation_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_premium BOOLEAN DEFAULT FALSE,
    template_structure JSONB -- Stores the default slide structure/sections
);

COMMENT ON TABLE public.templates IS 'Stores available pitch deck and proposal templates.';
COMMENT ON COLUMN public.templates.industry_relevance IS 'Stores industries this template is relevant for as JSON.';
COMMENT ON COLUMN public.templates.template_structure IS 'Defines the default sections and structure of the template as JSON.';

-- Apply trigger to templates
CREATE TRIGGER update_templates_modtime
BEFORE UPDATE ON public.templates
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- 3. Modify Profiles table (Assuming it exists with id UUID PK)
-- Add columns if they don't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS account_type TEXT,
ADD COLUMN IF NOT EXISTS organization_id UUID,
ADD COLUMN IF NOT EXISTS preferences JSONB;
-- Note: creation_date (created_at) and last_login likely handled by auth/existing triggers

-- Add Foreign Key constraint from Profiles to Organizations if it doesn't exist
DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_profiles_organization') THEN
      ALTER TABLE public.profiles
      ADD CONSTRAINT fk_profiles_organization
      FOREIGN KEY (organization_id)
      REFERENCES public.organizations(organization_id)
      ON DELETE SET NULL;
   END IF;
END
$$;

-- Add FK for admin_profile_id in organizations now that profiles table is confirmed/modified
-- Add Foreign Key constraint if it doesn't exist
DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_organizations_admin_profile') THEN
      ALTER TABLE public.organizations
      ADD CONSTRAINT fk_organizations_admin_profile
      FOREIGN KEY (admin_profile_id)
      REFERENCES public.profiles(id) -- Reference profiles table PK
      ON DELETE SET NULL;
   END IF;
END
$$;

COMMENT ON COLUMN public.profiles.account_type IS 'Type of user account (e.g., free, pro, enterprise).';
COMMENT ON COLUMN public.profiles.organization_id IS 'FK linking profile to their organization.';
COMMENT ON COLUMN public.profiles.preferences IS 'Stores profile-specific preferences as JSON.';

-- 4. Modify Projects table (Based on provided schema image)
-- Add columns if they don't exist
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS analytics_enabled BOOLEAN DEFAULT FALSE;
-- Note: project_type, creation_date, last_modified, status, visibility_settings, setup_details already exist per schema.

-- Add Foreign Key constraint from projects.user_id to profiles.id if it doesn't exist
DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_projects_profile') THEN
      ALTER TABLE public.projects
      ADD CONSTRAINT fk_projects_profile
      FOREIGN KEY (user_id) -- Assuming user_id is the column name in projects referencing profiles
      REFERENCES public.profiles(id)
      ON DELETE CASCADE; -- Or SET NULL, depending on desired behavior if profile is deleted
   END IF;
END
$$;

-- Add Foreign Key constraint from projects.default_template_id to templates.template_id if it doesn't exist
DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_projects_default_template') THEN
      ALTER TABLE public.projects
      ADD CONSTRAINT fk_projects_default_template
      FOREIGN KEY (default_template_id) -- Using existing column from schema
      REFERENCES public.templates(template_id)
      ON DELETE SET NULL; -- Allow projects to exist without a template
   END IF;
END
$$;

-- Apply trigger to projects if not already applied (assuming last_modified exists)
DO $$
BEGIN
   IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'last_modified') THEN
      IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_projects_modtime') THEN
         CREATE TRIGGER update_projects_modtime
         BEFORE UPDATE ON public.projects
         FOR EACH ROW
         EXECUTE FUNCTION update_modified_column();
      END IF;
   END IF;
END
$$;

-- Update comments for existing/added columns
COMMENT ON COLUMN public.projects.user_id IS 'FK linking project to the profile of the owner/creator.';
COMMENT ON COLUMN public.projects.default_template_id IS 'FK linking project to the chosen default template.';
COMMENT ON COLUMN public.projects.analytics_enabled IS 'Flag indicating if analytics tracking is enabled for this project.';
-- Existing comments for project_type, visibility_settings etc. are assumed to be sufficient.

-- 5. Create ProjectContents table
CREATE TABLE IF NOT EXISTS public.project_contents (
    content_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    section_type TEXT NOT NULL, -- e.g., 'executive_summary', 'problem_statement'
    content_text TEXT, -- Using TEXT for Markdown or rich text
    section_order INTEGER NOT NULL,
    visibility_status TEXT DEFAULT 'included', -- e.g., 'included', 'hidden'
    creation_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    modified_by_profile_id UUID, -- FK to profiles table
    generation_prompt TEXT, -- Store the AI prompt used, if any
    CONSTRAINT fk_project_contents_project
        FOREIGN KEY(project_id)
        REFERENCES public.projects(project_id)
        ON DELETE CASCADE, -- Delete content when project is deleted
    CONSTRAINT fk_project_contents_modifier
        FOREIGN KEY(modified_by_profile_id) -- Correct column name
        REFERENCES public.profiles(id) -- Correct referenced table and column
        ON DELETE SET NULL -- Keep content even if modifier profile is deleted
);

CREATE INDEX IF NOT EXISTS idx_project_contents_project_id ON public.project_contents(project_id);
CREATE INDEX IF NOT EXISTS idx_project_contents_section_order ON public.project_contents(project_id, section_order);

COMMENT ON TABLE public.project_contents IS 'Stores the textual content for each section of a project.';
COMMENT ON COLUMN public.project_contents.section_type IS 'Identifier for the type of content section (e.g., executive_summary).';
COMMENT ON COLUMN public.project_contents.content_text IS 'The actual content, potentially Markdown formatted.';
COMMENT ON COLUMN public.project_contents.section_order IS 'Order of the section within the project.';
COMMENT ON COLUMN public.project_contents.visibility_status IS 'Whether the section is currently included or hidden.';
COMMENT ON COLUMN public.project_contents.modified_by_profile_id IS 'FK to the profile who last modified this content.';
COMMENT ON COLUMN public.project_contents.generation_prompt IS 'The AI prompt used to generate this content, if applicable.';

-- Apply trigger to project_contents
CREATE TRIGGER update_project_contents_modtime
BEFORE UPDATE ON public.project_contents
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- 6. Create VisualElements table
CREATE TABLE IF NOT EXISTS public.visual_elements (
    element_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    content_id UUID, -- Optional link to a specific content section
    element_type TEXT NOT NULL, -- e.g., 'chart', 'table', 'diagram', 'image'
    element_data JSONB NOT NULL, -- Stores configuration, data, styling etc.
    creation_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    modified_by_profile_id UUID, -- FK to profiles table
    source_data_reference TEXT, -- Info about external data source if any
    fact_checked BOOLEAN DEFAULT FALSE,
    element_order INTEGER, -- Order within a content section or project
    CONSTRAINT fk_visual_elements_project
        FOREIGN KEY(project_id)
        REFERENCES public.projects(project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_visual_elements_content
        FOREIGN KEY(content_id)
        REFERENCES public.project_contents(content_id)
        ON DELETE SET NULL, -- Allow element to exist even if section is deleted
    CONSTRAINT fk_visual_elements_modifier
        FOREIGN KEY(modified_by_profile_id) -- Correct column name
        REFERENCES public.profiles(id) -- Correct referenced table and column
        ON DELETE SET NULL -- Keep element even if modifier profile is deleted
);

CREATE INDEX IF NOT EXISTS idx_visual_elements_project_id ON public.visual_elements(project_id);
CREATE INDEX IF NOT EXISTS idx_visual_elements_content_id ON public.visual_elements(content_id);

COMMENT ON TABLE public.visual_elements IS 'Stores visual elements like charts, tables, images associated with a project.';
COMMENT ON COLUMN public.visual_elements.content_id IS 'Optional FK linking the element to a specific content section.';
COMMENT ON COLUMN public.visual_elements.element_type IS 'Type of visual element (chart, table, etc.).';
COMMENT ON COLUMN public.visual_elements.element_data IS 'JSONB data storing element configuration, data, and styling.';
COMMENT ON COLUMN public.visual_elements.modified_by_profile_id IS 'FK to the profile who last modified this element.';
COMMENT ON COLUMN public.visual_elements.source_data_reference IS 'Reference to external data source, if applicable.';
COMMENT ON COLUMN public.visual_elements.fact_checked IS 'Indicates if the data within the element has been fact-checked.';
COMMENT ON COLUMN public.visual_elements.element_order IS 'Order of the element within its context (section or project).';

-- Apply trigger to visual_elements
CREATE TRIGGER update_visual_elements_modtime
BEFORE UPDATE ON public.visual_elements
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- 7. Create ProjectCollaborators table
CREATE TABLE IF NOT EXISTS public.project_collaborators (
    collaboration_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    profile_id UUID NOT NULL, -- Renamed from user_id
    role TEXT NOT NULL DEFAULT 'viewer', -- e.g., 'viewer', 'editor', 'admin'
    invite_status TEXT DEFAULT 'pending', -- e.g., 'pending', 'accepted', 'declined'
    join_date TIMESTAMPTZ,
    last_active TIMESTAMPTZ,
    CONSTRAINT fk_project_collaborators_project
        FOREIGN KEY(project_id)
        REFERENCES public.projects(project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_project_collaborators_profile -- Renamed constraint
        FOREIGN KEY(profile_id) -- Correct column name
        REFERENCES public.profiles(id) -- Correct referenced table and column
        ON DELETE CASCADE,
    UNIQUE (project_id, profile_id) -- Ensure a profile is only added once per project
);

CREATE INDEX IF NOT EXISTS idx_project_collaborators_project_id ON public.project_collaborators(project_id);
CREATE INDEX IF NOT EXISTS idx_project_collaborators_profile_id ON public.project_collaborators(profile_id); -- Updated index

COMMENT ON TABLE public.project_collaborators IS 'Maps profiles to projects they collaborate on, defining their roles.';
COMMENT ON COLUMN public.project_collaborators.role IS 'Role of the user within the project (viewer, editor, admin).';
COMMENT ON COLUMN public.project_collaborators.invite_status IS 'Status of the collaboration invitation.';

-- 8. Create ProjectVersions table
CREATE TABLE IF NOT EXISTS public.project_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    version_number INTEGER NOT NULL,
    version_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by_profile_id UUID, -- FK to profiles table
    version_description TEXT,
    snapshot JSONB, -- Store a snapshot of project data (or reference changes)
    exportable BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_project_versions_project
        FOREIGN KEY(project_id)
        REFERENCES public.projects(project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_project_versions_creator
        FOREIGN KEY(created_by_profile_id) -- Correct column name
        REFERENCES public.profiles(id) -- Correct referenced table and column
        ON DELETE SET NULL,
    UNIQUE (project_id, version_number) -- Ensure version numbers are unique per project
);

CREATE INDEX IF NOT EXISTS idx_project_versions_project_id ON public.project_versions(project_id);

COMMENT ON TABLE public.project_versions IS 'Stores historical versions or snapshots of projects.';
COMMENT ON COLUMN public.project_versions.version_number IS 'Sequential number for the version within the project.';
COMMENT ON COLUMN public.project_versions.created_by_profile_id IS 'FK to the profile who created this version.';
COMMENT ON COLUMN public.project_versions.version_description IS 'Optional description of the changes in this version.';
COMMENT ON COLUMN public.project_versions.snapshot IS 'JSONB storing a snapshot of the project state at this version.';
COMMENT ON COLUMN public.project_versions.exportable IS 'Indicates if this version can be exported.';

-- 9. Create ProjectFeedback table
CREATE TABLE IF NOT EXISTS public.project_feedback (
    feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    profile_id UUID, -- Profile providing feedback (can be null for anonymous?)
    feedback_type TEXT NOT NULL, -- e.g., 'comment', 'suggestion', 'rating'
    feedback_content TEXT NOT NULL,
    associated_content_id UUID, -- Link to specific ProjectContents item
    associated_element_id UUID, -- Link to specific VisualElements item
    creation_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'open', -- e.g., 'open', 'addressed', 'rejected'
    resolved_by_profile_id UUID, -- Profile who resolved the feedback
    resolved_date TIMESTAMPTZ,
    CONSTRAINT fk_project_feedback_project
        FOREIGN KEY(project_id)
        REFERENCES public.projects(project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_project_feedback_profile -- Renamed constraint
        FOREIGN KEY(profile_id) -- Correct column name
        REFERENCES public.profiles(id) -- Correct referenced table and column
        ON DELETE SET NULL,
    CONSTRAINT fk_project_feedback_content
        FOREIGN KEY(associated_content_id)
        REFERENCES public.project_contents(content_id)
        ON DELETE SET NULL,
    CONSTRAINT fk_project_feedback_element
        FOREIGN KEY(associated_element_id)
        REFERENCES public.visual_elements(element_id)
        ON DELETE SET NULL,
    CONSTRAINT fk_project_feedback_resolver
        FOREIGN KEY(resolved_by_profile_id) -- Correct column name
        REFERENCES public.profiles(id) -- Correct referenced table and column
        ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_project_feedback_project_id ON public.project_feedback(project_id);
CREATE INDEX IF NOT EXISTS idx_project_feedback_profile_id ON public.project_feedback(profile_id); -- Updated index
CREATE INDEX IF NOT EXISTS idx_project_feedback_content_id ON public.project_feedback(associated_content_id);
CREATE INDEX IF NOT EXISTS idx_project_feedback_element_id ON public.project_feedback(associated_element_id);

COMMENT ON TABLE public.project_feedback IS 'Stores feedback, comments, and suggestions related to projects.';
COMMENT ON COLUMN public.project_feedback.profile_id IS 'FK to the profile providing the feedback (nullable for anonymous).';
COMMENT ON COLUMN public.project_feedback.feedback_type IS 'Type of feedback (comment, suggestion, rating).';
COMMENT ON COLUMN public.project_feedback.associated_content_id IS 'Optional FK linking feedback to a specific content section.';
COMMENT ON COLUMN public.project_feedback.associated_element_id IS 'Optional FK linking feedback to a specific visual element.';
COMMENT ON COLUMN public.project_feedback.status IS 'Current status of the feedback item.';
COMMENT ON COLUMN public.project_feedback.resolved_by_profile_id IS 'FK to the profile who resolved the feedback.';

-- 10. Create ProjectAnalytics table
CREATE TABLE IF NOT EXISTS public.project_analytics (
    analytics_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL UNIQUE, -- One analytics record per project
    view_count INTEGER DEFAULT 0,
    average_view_duration INTERVAL, -- Store duration (e.g., seconds)
    completion_rate NUMERIC(5, 2), -- Percentage (e.g., 85.50)
    section_engagement JSONB, -- e.g., {"section_id": "views": 10, "time_spent": 120}
    outcome_status TEXT, -- e.g., 'won', 'lost', 'pending', 'funded'
    outcome_details JSONB, -- Store details like funding amount, deal value etc.
    last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_project_analytics_project
        FOREIGN KEY(project_id)
        REFERENCES public.projects(project_id)
        ON DELETE CASCADE
);

COMMENT ON TABLE public.project_analytics IS 'Stores analytics data for shared or presented projects.';
COMMENT ON COLUMN public.project_analytics.project_id IS 'FK linking analytics to a specific project (unique).';
COMMENT ON COLUMN public.project_analytics.average_view_duration IS 'Average time viewers spent on the presentation.';
COMMENT ON COLUMN public.project_analytics.completion_rate IS 'Percentage of the presentation viewed on average.';
COMMENT ON COLUMN public.project_analytics.section_engagement IS 'JSONB data detailing engagement per section.';
COMMENT ON COLUMN public.project_analytics.outcome_status IS 'The final outcome of the pitch or proposal.';
COMMENT ON COLUMN public.project_analytics.outcome_details IS 'JSONB storing specific details about the outcome.';

-- Apply trigger to project_analytics
CREATE TRIGGER update_project_analytics_modtime
BEFORE UPDATE ON public.project_analytics
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

COMMIT;