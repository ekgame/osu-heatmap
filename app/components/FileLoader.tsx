import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { LuUpload } from "react-icons/lu";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { BeatmapFileError, loadLocalFile } from "~/lib/localBeatmaps";

interface FileLoader {
    selectFile: () => void;
    isLoading: boolean;
}

const FileLoaderContext = createContext<FileLoader|null>(null);

export function useFileLoader(): FileLoader {
    const context = useContext(FileLoaderContext);
    if (!context) {
        throw new Error('useFileLoader must be used within a FileLoaderProvider');
    }
    return context;
}

export function FileLoaderProvider({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const loadFile = useCallback(async (file: File) => {
        setIsLoading(true);
        try {
            const id = await loadLocalFile(file);
            navigate('/local', { state: { id } });
        } catch (e) {
            toast.error('Could not load the beatmap', {
                description: e instanceof BeatmapFileError ? e.message : 'Failed to load the file.',
            });
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        noClick: true,
        noKeyboard: true,
        multiple: false,
        onDrop: (files) => {
            if (files[0]) {
                loadFile(files[0]);
            }
        },
    });

    const value = useMemo(() => ({ selectFile: open, isLoading }), [open, isLoading]);

    return (
        <FileLoaderContext.Provider value={value}>
            <div {...getRootProps()}>
                <input {...getInputProps({ accept: '.osu,.osz' })} />
                {children}

                {isDragActive && (
                    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-ink-950/90 p-4">
                        <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-xs border border-dashed border-accent bg-ink-900 p-10 text-center">
                            <LuUpload size={32} className="text-accent" />
                            <div className="text-lg font-semibold">Drop the beatmap to load it</div>
                            <div className="text-sm text-ink-300">.osu and .osz files</div>
                        </div>
                    </div>
                )}
            </div>
        </FileLoaderContext.Provider>
    );
}
