"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { ProjectForm } from "@/components/project-form";
import {
  getProjectItem,
  removeEntityImages,
  replaceEntityImage,
  updateProjectItem,
  type ProjectInput,
  type ProjectItem
} from "@/lib/admin-api";

export default function UpdateProjectItemPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [projectItem, setProjectItem] = useState<ProjectItem | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getProjectItem(params.id)
      .then(({ project }) => {
        if (isMounted) {
          setProjectItem(project);
          setIsLoading(false);
        }
      })
      .catch((loadError) => {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load project."
          );
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  async function handleSubmit(input: ProjectInput) {
    setError("");
    setIsSubmitting(true);
    try {
      const { imageFile, removeImage, ...payload } = input;
      const { project } = await updateProjectItem(params.id, payload);
      if (imageFile) {
        await replaceEntityImage("project", project.id, imageFile);
      } else if (removeImage) {
        await removeEntityImages("project", project.id);
      }
      router.replace("/projects");
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update project."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminShell>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Projects
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Update Project
          </h2>
        </div>
        <Link
          className="rounded-lg border border-border px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary"
          href="/projects"
        >
          Back to Projects
        </Link>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-lg border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
          Loading project...
        </div>
      ) : null}

      {!isLoading && projectItem ? (
        <ProjectForm
          initialProject={projectItem}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      ) : null}
    </AdminShell>
  );
}
