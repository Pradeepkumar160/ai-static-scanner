import tempfile, shutil
from git import Repo, GitCommandError
from fastapi import HTTPException

def clone_repo(repo_url: str) -> str:
    tmp = tempfile.mkdtemp(prefix="scanner_")
    try:
        Repo.clone_from(repo_url, tmp, depth=1)
        return tmp
    except GitCommandError as e:
        shutil.rmtree(tmp, ignore_errors=True)
        raise HTTPException(status_code=400, detail=f"Failed to clone repo: {e}")
