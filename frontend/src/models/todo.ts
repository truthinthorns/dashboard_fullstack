export default class Todo {
    user_id: string;
    description: string;
    title: string;
    date_created: string;
    finish_by: string | null;
    status: string | null;
    resolution: string | null;
    tags: string[] | null;
    priority: number | null;
    constructor(
        user_id: string,
        description: string,
        title: string,
        date_created: string,
        finish_by: string | null,
        status: string | null,
        resolution: string | null,
        tags: string[] | null,
        priority: number | null
    ) {
        this.user_id = user_id;
        this.description = description;
        this.title = title;
        this.date_created = date_created;
        this.finish_by = finish_by;
        this.status = status;
        this.resolution = resolution;
        this.tags = tags;
        this.priority = priority;
    }
}
