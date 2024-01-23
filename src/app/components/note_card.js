import { Trash2, Maximize2 } from 'lucide-react';

export default function NoteCard(params) {
    
    const handleDelete = () => {
        if(params.onDelete) {
            params.onDelete(params.uuid);
        }
    }

    const handleOpen = () => {
        if(params.onOpen) {
            params.onOpen(params.index);
        }
    }

    return (
        <div className="card border-2 border-base-100 shadow-xl group">
            <div className="card-body p-4">
                <div className="flex justify-between">
                    <h2 className="card-title">{params.title}</h2>
                    <div className="flex group-hover:flex hidden">
                        <button className="btn btn-ghost btn-xs opacity-50 hover:bg-transparent hover:opacity-100" onClick={handleOpen}>
                            <Maximize2 />
                        </button>
                        <button className="btn btn-ghost btn-xs opacity-50 hover:bg-transparent hover:opacity-100" onClick={handleDelete}>
                            <Trash2 color='#ff4444' />
                        </button>
                    </div>
                </div>
                <p>{params.body.length > 100 ? params.body.substring(0, 200) + '...' : params.body}</p>
                <div className="card-actions justify-end">
                {/* <div className="badge badge-outline">Fashion</div> 
                <div className="badge badge-outline">Products</div> */}
                </div>
            </div>
        </div>
    );
}