#!/usr/bin/env python
"""
Script to query and delete sandboxes for a given account ID.

Usage:
    python delete_user_sandboxes.py <account_id>
"""

import asyncio
import sys
from typing import List, Dict, Any
from dotenv import load_dotenv

# Load script-specific environment variables
load_dotenv(".env")

from services.supabase import DBConnection
from sandbox.sandbox import daytona
from utils.logger import logger


async def get_user_sandboxes(account_id: str) -> List[Dict[str, Any]]:
    """
    Query all projects and their sandboxes associated with a specific account ID.

    Args:
        account_id: The account ID to query

    Returns:
        List of projects with sandbox information
    """
    db = DBConnection()
    client = await db.client

    # Print the Supabase URL being used
    print("Using Supabase URL: {os.getenv('SUPABASE_URL')}")

    # Query projects by account_id
    result = await client.table('projects').select(
        'project_id',
        'name',
        'sandbox'
    ).eq('account_id', account_id).execute()

    # Print the query result for debugging
    print("Query result: {result}")

    if not result.data:
        logger.info("No projects found for account ID: {account_id}")
        return []

    # Filter projects with sandbox information
    projects_with_sandboxes = [
        project for project in result.data
        if project.get('sandbox') and project['sandbox'].get('id')
    ]

    logger.info("Found {len(projects_with_sandboxes)} projects with sandboxes for account ID: {account_id}")
    return projects_with_sandboxes


async def delete_sandboxes(projects: List[Dict[str, Any]]) -> None:
    """
    Delete all sandboxes from the provided list of projects.

    Args:
        projects: List of projects with sandbox information
    """
    if not projects:
        logger.info("No sandboxes to delete")
        return

    for project in projects:
        sandbox_id = project['sandbox'].get('id')
        project_name = project.get('name', 'Unknown')
        project_id = project.get('project_id', 'Unknown')

        if not sandbox_id:
            continue

        try:
            logger.info("Deleting sandbox {sandbox_id} for project '{project_name}' (ID: {project_id})")

            # Get the sandbox and delete it
            sandbox = daytona.get_current_sandbox(sandbox_id)
            daytona.delete(sandbox)

            logger.info("Successfully deleted sandbox {sandbox_id}")
        except Exception as e:
            logger.error("Error deleting sandbox {sandbox_id}: {str(e)}")


async def main():
    """Main function to run the script."""
    if len(sys.argv) != 2:
        print("Usage: python {sys.argv[0]} <account_id>")
        sys.exit(1)

    account_id = sys.argv[1]
    logger.info("Starting sandbox cleanup for account ID: {account_id}")

    # Print environment info
    print("Environment Mode: {os.getenv('ENV_MODE', 'Not set')}")
    print("Daytona Server: {os.getenv('DAYTONA_SERVER_URL', 'Not set')}")

    try:
        # Query projects with sandboxes
        projects = await get_user_sandboxes(account_id)

        # Print sandbox information
        for i, project in enumerate(projects):
            sandbox_id = project['sandbox'].get('id', 'N/A')
            print("{i+1}. Project: {project.get('name', 'Unknown')}")
            print("   Project ID: {project.get('project_id', 'Unknown')}")
            print("   Sandbox ID: {sandbox_id}")

        # Confirm deletion
        if projects:
            confirm = input("\nDelete {len(projects)} sandboxes? (y/n): ")
            if confirm.lower() == 'y':
                await delete_sandboxes(projects)
                logger.info("Sandbox cleanup completed")
            else:
                logger.info("Sandbox deletion cancelled")
        else:
            logger.info("No sandboxes found for deletion")

    except Exception as e:
        logger.error("Error during sandbox cleanup: {str(e)}")
        sys.exit(1)
    finally:
        # Clean up database connection
        await DBConnection.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
