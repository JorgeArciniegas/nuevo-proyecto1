from dagster import AssetExecutionContext
from dagster_dbt import DbtCliResource, dbt_assets

from .project import nuevo_proyecto_project


@dbt_assets(manifest=nuevo_proyecto_project.manifest_path)
def nuevo_proyecto_dbt_assets(context: AssetExecutionContext, dbt: DbtCliResource):
    yield from dbt.cli(["build"], context=context).stream()
    

