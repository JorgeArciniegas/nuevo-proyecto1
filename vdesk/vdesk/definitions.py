from dagster import Definitions
from dagster_dbt import DbtCliResource
from .assets import nuevo_proyecto_dbt_assets
from .project import nuevo_proyecto_project
from .schedules import schedules

defs = Definitions(
    assets=[nuevo_proyecto_dbt_assets],
    schedules=schedules,
    resources={
        "dbt": DbtCliResource(project_dir=nuevo_proyecto_project),
    },
)

