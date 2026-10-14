import { FileText, ImagePlus, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type ProjectEditorialPanelProps = {
  projectId: number;
  photos: Array<{
    id: number;
    title?: string | null;
    description?: string | null;
  }>;
  documents: Array<{
    id: number;
    title: string;
    category?: string | null;
    fileName: string;
  }>;
};

const MAX_DOCUMENT_BYTES = 20 * 1024 * 1024;

function readFileAsDataUrl(file: File, onLoad: (data: string) => void) {
  const reader = new FileReader();
  reader.onload = () => onLoad(String(reader.result));
  reader.onerror = () =>
    toast.error("Não foi possível ler o arquivo selecionado.");
  reader.readAsDataURL(file);
}

export function ProjectEditorialPanel({
  projectId,
  photos,
  documents,
}: ProjectEditorialPanelProps) {
  const utils = trpc.useUtils();
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoDescription, setPhotoDescription] = useState("");
  const [document, setDocument] = useState<File | null>(null);
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentCategory, setDocumentCategory] = useState("");

  const refreshProject = () => {
    void utils.dashboard.project.invalidate({ id: projectId });
  };
  const uploadPhoto = trpc.admin.uploadPhoto.useMutation({
    onSuccess: () => {
      toast.success("Foto adicionada à galeria do projeto.");
      setPhoto(null);
      setPhotoTitle("");
      setPhotoDescription("");
      refreshProject();
    },
    onError: error => toast.error(error.message),
  });
  const uploadDocument = trpc.admin.uploadDocument.useMutation({
    onSuccess: () => {
      toast.success("Documento adicionado aos materiais do projeto.");
      setDocument(null);
      setDocumentTitle("");
      setDocumentCategory("");
      refreshProject();
    },
    onError: error => toast.error(error.message),
  });
  const updatePhoto = trpc.admin.updatePhoto.useMutation({
    onSuccess: () => {
      toast.success("Legenda da foto atualizada.");
      refreshProject();
    },
    onError: error => toast.error(error.message),
  });
  const updateDocument = trpc.admin.updateDocument.useMutation({
    onSuccess: () => {
      toast.success("Documento reorganizado.");
      refreshProject();
    },
    onError: error => toast.error(error.message),
  });

  const submitPhoto = () => {
    if (!photo || !photo.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem válido.");
      return;
    }
    readFileAsDataUrl(photo, data =>
      uploadPhoto.mutate({
        projectId,
        fileName: photo.name,
        mimeType: photo.type,
        data,
        title: photoTitle.trim() || undefined,
        description: photoDescription.trim() || undefined,
      })
    );
  };

  const submitDocument = () => {
    if (!document || !documentTitle.trim()) return;
    if (document.size > MAX_DOCUMENT_BYTES) {
      toast.error("O documento deve ter no máximo 20 MB.");
      return;
    }
    readFileAsDataUrl(document, data =>
      uploadDocument.mutate({
        projectId,
        fileName: document.name,
        mimeType: document.type || "application/octet-stream",
        data,
        title: documentTitle.trim(),
        category: documentCategory.trim() || undefined,
        sizeBytes: document.size,
      })
    );
  };

  return (
    <Card className="mt-8 border-[#e30613]/30 bg-[#fffafa]">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-black text-neutral-900">
          <Upload className="h-5 w-5 text-[#e30613]" />
          Edição do projeto
        </CardTitle>
        <p className="text-sm leading-6 text-neutral-600">
          Inclua e classifique evidências diretamente neste projeto. A permissão
          é validada novamente no servidor conforme seu perfil e setor.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-4">
            <h3 className="flex items-center gap-2 font-black text-neutral-900">
              <ImagePlus className="h-4 w-4 text-[#e30613]" />
              Organizar galeria de fotos
            </h3>
            <div>
              <Label htmlFor="project-photo-file">Imagem</Label>
              <Input
                id="project-photo-file"
                className="mt-2"
                type="file"
                accept="image/*"
                onChange={event => setPhoto(event.target.files?.[0] ?? null)}
              />
            </div>
            <div>
              <Label htmlFor="project-photo-title">Título da foto</Label>
              <Input
                id="project-photo-title"
                className="mt-2"
                value={photoTitle}
                onChange={event => setPhotoTitle(event.target.value)}
                placeholder="Ex.: Conferência do inventário"
                maxLength={160}
              />
            </div>
            <div>
              <Label htmlFor="project-photo-description">Descrição</Label>
              <Textarea
                id="project-photo-description"
                className="mt-2"
                value={photoDescription}
                onChange={event => setPhotoDescription(event.target.value)}
                placeholder="Contextualize o registro visual."
              />
            </div>
            <Button
              type="button"
              disabled={uploadPhoto.isPending || !photo}
              onClick={submitPhoto}
              className="bg-[#e30613] hover:bg-[#c80511]"
            >
              {uploadPhoto.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ImagePlus className="h-4 w-4" />
              )}
              Adicionar foto
            </Button>
          </div>

          <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-4">
            <h3 className="flex items-center gap-2 font-black text-neutral-900">
              <FileText className="h-4 w-4 text-[#e30613]" />
              Organizar documentos e materiais
            </h3>
            <div>
              <Label htmlFor="project-document-file">Arquivo</Label>
              <Input
                id="project-document-file"
                className="mt-2"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.jpg,.jpeg,.png,.webp,.zip"
                onChange={event => setDocument(event.target.files?.[0] ?? null)}
              />
            </div>
            <div>
              <Label htmlFor="project-document-title">Título do material</Label>
              <Input
                id="project-document-title"
                className="mt-2"
                value={documentTitle}
                onChange={event => setDocumentTitle(event.target.value)}
                placeholder="Ex.: Plano de Ação 2026"
                maxLength={200}
              />
            </div>
            <div>
              <Label htmlFor="project-document-category">Categoria</Label>
              <Input
                id="project-document-category"
                className="mt-2"
                value={documentCategory}
                onChange={event => setDocumentCategory(event.target.value)}
                placeholder="Ex.: Plano de ação, manual, relatório"
                maxLength={80}
              />
            </div>
            {document ? (
              <p className="text-xs text-neutral-500">
                {document.name} · {(document.size / 1024).toFixed(1)} KB
              </p>
            ) : null}
            <Button
              type="button"
              disabled={
                uploadDocument.isPending ||
                !document ||
                !documentTitle.trim() ||
                Boolean(document && document.size > MAX_DOCUMENT_BYTES)
              }
              onClick={submitDocument}
              className="bg-[#e30613] hover:bg-[#c80511]"
            >
              {uploadDocument.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              Adicionar documento
            </Button>
          </div>
        </div>
        <div className="grid gap-6 border-t border-neutral-200 pt-6 lg:grid-cols-2">
          <div>
            <h3 className="mb-3 font-black text-neutral-900">
              Fotos já cadastradas
            </h3>
            <div className="space-y-3">
              {photos.length ? (
                photos.map(item => (
                  <PhotoMetadataEditor
                    key={item.id}
                    photo={item}
                    projectId={projectId}
                    loading={updatePhoto.isPending}
                    onSave={data =>
                      updatePhoto.mutate({ id: item.id, projectId, data })
                    }
                  />
                ))
              ) : (
                <p className="text-sm text-neutral-500">
                  Nenhuma foto cadastrada para organizar.
                </p>
              )}
            </div>
          </div>
          <div>
            <h3 className="mb-3 font-black text-neutral-900">
              Documentos já cadastrados
            </h3>
            <div className="space-y-3">
              {documents.length ? (
                documents.map(item => (
                  <DocumentMetadataEditor
                    key={item.id}
                    document={item}
                    projectId={projectId}
                    loading={updateDocument.isPending}
                    onSave={data =>
                      updateDocument.mutate({ id: item.id, projectId, data })
                    }
                  />
                ))
              ) : (
                <p className="text-sm text-neutral-500">
                  Nenhum documento cadastrado para organizar.
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type PhotoMetadata = {
  title?: string;
  description?: string;
};

type DocumentMetadata = {
  title: string;
  category?: string;
};

function PhotoMetadataEditor({
  photo,
  loading,
  onSave,
}: {
  photo: { id: number; title?: string | null; description?: string | null };
  projectId: number;
  loading: boolean;
  onSave: (data: PhotoMetadata) => void;
}) {
  const [title, setTitle] = useState(photo.title ?? "");
  const [description, setDescription] = useState(photo.description ?? "");
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-3">
      <Input
        value={title}
        maxLength={160}
        aria-label={`Título da foto ${photo.id}`}
        onChange={event => setTitle(event.target.value)}
        placeholder="Título da foto"
      />
      <Textarea
        className="mt-2"
        value={description}
        aria-label={`Descrição da foto ${photo.id}`}
        onChange={event => setDescription(event.target.value)}
        placeholder="Descrição da foto"
      />
      <Button
        type="button"
        size="sm"
        disabled={loading}
        onClick={() =>
          onSave({
            title: title.trim() || undefined,
            description: description.trim() || undefined,
          })
        }
        className="mt-2 bg-[#171717] hover:bg-[#333]"
      >
        Salvar legenda
      </Button>
    </div>
  );
}

function DocumentMetadataEditor({
  document,
  loading,
  onSave,
}: {
  document: {
    id: number;
    title: string;
    category?: string | null;
    fileName: string;
  };
  projectId: number;
  loading: boolean;
  onSave: (data: DocumentMetadata) => void;
}) {
  const [title, setTitle] = useState(document.title);
  const [category, setCategory] = useState(document.category ?? "");
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-3">
      <p className="mb-2 truncate text-xs text-neutral-500">
        {document.fileName}
      </p>
      <Input
        value={title}
        maxLength={200}
        aria-label={`Título do documento ${document.id}`}
        onChange={event => setTitle(event.target.value)}
        placeholder="Título do documento"
      />
      <Input
        className="mt-2"
        value={category}
        maxLength={80}
        aria-label={`Categoria do documento ${document.id}`}
        onChange={event => setCategory(event.target.value)}
        placeholder="Categoria"
      />
      <Button
        type="button"
        size="sm"
        disabled={loading || !title.trim()}
        onClick={() =>
          onSave({
            title: title.trim(),
            category: category.trim() || undefined,
          })
        }
        className="mt-2 bg-[#171717] hover:bg-[#333]"
      >
        Salvar organização
      </Button>
    </div>
  );
}
