from azure.cosmos import CosmosClient, PartitionKey, exceptions
from azure.identity import DefaultAzureCredential
from config import COSMOS_ENDPOINT, COSMOS_DATABASE, COSMOS_CONTAINER


def get_cosmos_client():
    credential = DefaultAzureCredential()
    return CosmosClient(COSMOS_ENDPOINT, credential=credential)


def get_database():
    client = get_cosmos_client()
    return client.create_database_if_not_exists(id=COSMOS_DATABASE)


def get_container():
    database = get_database()
    return database.create_container_if_not_exists(
        id=COSMOS_CONTAINER,
        partition_key=PartitionKey(path="/category"),
        offer_throughput=400,
    )


def create_item(item: dict):
    container = get_container()
    return container.create_item(body=item)


def read_item(item_id: str, category: str):
    container = get_container()
    try:
        return container.read_item(item=item_id, partition_key=category)
    except exceptions.CosmosResourceNotFoundError:
        return None


def read_all_items():
    container = get_container()
    return list(container.read_all_items())


def update_item(item: dict):
    container = get_container()
    try:
        return container.upsert_item(body=item)
    except exceptions.CosmosResourceNotFoundError:
        return None


def delete_item(item_id: str, category: str):
    container = get_container()
    try:
        container.delete_item(item=item_id, partition_key=category)
        return True
    except exceptions.CosmosResourceNotFoundError:
        return False
